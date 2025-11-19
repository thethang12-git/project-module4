import axios from "axios";
import {
    CategoryApiModel,
    TransactionApiModel,
    Wallet,
    WalletActivity,
    WalletApiModel,
    WalletDashboardData,
    WalletQuickAction,
    WalletSummary
} from "@/src/types/wallet";

const API_BASE_URL = process.env.NEXT_PUBLIC_DB_API ?? "http://localhost:3001";

const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000
});

const quickActionsSeed: WalletQuickAction[] = [
    {label: "Nạp tiền", description: "Cập nhật số dư mới", color: "from-blue-500/90 to-blue-400"},
    {label: "Rút tiền", description: "Di chuyển sang ví khác", color: "from-purple-500/90 to-purple-400"},
    {label: "Thêm ví", description: "Tạo nguồn tiền mới", color: "from-emerald-500/90 to-emerald-400"},
    {label: "Xuất báo cáo", description: "Tổng hợp chi tiêu", color: "from-amber-500/90 to-amber-400"}
];

const walletTypeFromIcon = (icon?: string): Wallet["type"] => {
    if (!icon) return "cash";
    if (icon.includes("bank") || icon.includes("card")) return "card";
    if (icon.includes("moneybag") || icon.includes("wallet")) return "cash";
    return "savings";
};

const formatRelativeTime = (isoDate?: string): string => {
    if (!isoDate) return "Chưa có giao dịch";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "Chưa có giao dịch";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
};

const normalizeWallets = (
    wallets: WalletApiModel[],
    transactions: TransactionApiModel[]
): Wallet[] => {
    const transactionsByWallet = transactions.reduce<Record<string, TransactionApiModel[]>>((acc, tx) => {
        const walletId = tx.walletId.toString();
        acc[walletId] = acc[walletId] ? [...acc[walletId], tx] : [tx];
        return acc;
    }, {});

    return wallets.map((wallet) => {
        const walletTransactions = transactionsByWallet[wallet.id] ?? [];
        const latestTx = walletTransactions
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const baseAmount = wallet.default_balance || wallet.current_balance || 0;
        const delta = baseAmount
            ? ((wallet.current_balance - baseAmount) / baseAmount) * 100
            : 0;
        const trend = delta >= 0 ? "up" : "down";

        return {
            id: wallet.id,
            name: wallet.name,
            type: walletTypeFromIcon(wallet.icon),
            balance: wallet.current_balance,
            limit: wallet.default_balance,
            currency: "VND",
            trend,
            change: Math.abs(Number(delta.toFixed(1))),
            lastUpdated: latestTx ? formatRelativeTime(latestTx.date) : "Chưa có giao dịch"
        };
    });
};

const buildActivities = (
    transactions: TransactionApiModel[],
    categories: CategoryApiModel[]
): WalletActivity[] => {
    const categoryMap = categories.reduce<Record<string, CategoryApiModel>>((acc, category) => {
        acc[category.id.toString()] = category;
        return acc;
    }, {});

    return transactions
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6)
        .map((tx) => {
            const category = categoryMap[tx.categoryId.toString()];
            const isIncome = category?.is_income ?? tx.money >= 0;
            return {
                id: tx.id,
                label: tx.name,
                amount: Math.abs(tx.money),
                category: category?.name ?? "Khác",
                direction: isIncome ? "income" : "expense",
                time: formatRelativeTime(tx.date)
            };
        });
};

const formatSummary = (wallets: Wallet[], baselineTotal: number, lastSnapshot: string): WalletSummary => {
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const positiveWallets = wallets.filter((wallet) => wallet.balance >= 0).length;
    const negativeWallets = wallets.length - positiveWallets;
    const growth = baselineTotal
        ? Number((((totalBalance - baselineTotal) / baselineTotal) * 100).toFixed(1))
        : 0;

    return {
        totalBalance,
        totalWallets: wallets.length,
        positiveWallets,
        negativeWallets,
        growthRate: growth,
        lastSnapshot
    };
};

class WalletService {
    static async fetchWallets(userId: string | number): Promise<WalletApiModel[]> {
        const {data} = await http.get<WalletApiModel[]>("/wallets", {
            params: {userId}
        });
        return data;
    }

    static async fetchTransactions(userId: string | number): Promise<TransactionApiModel[]> {
        const {data} = await http.get<TransactionApiModel[]>("/transactions", {
            params: {userId}
        });
        return data;
    }

    static async fetchCategories(userId: string | number): Promise<CategoryApiModel[]> {
        const {data} = await http.get<CategoryApiModel[]>("/categories", {
            params: {userId}
        });
        return data;
    }

    static async fetchQuickActions(): Promise<WalletQuickAction[]> {
        return quickActionsSeed;
    }

    static async fetchDashboard(userId: string | number): Promise<WalletDashboardData> {
        const [walletsRaw, transactionsRaw, categories, quickActions] = await Promise.all([
            this.fetchWallets(userId),
            this.fetchTransactions(userId),
            this.fetchCategories(userId),
            this.fetchQuickActions()
        ]);

        const wallets = normalizeWallets(walletsRaw, transactionsRaw);
        const activities = buildActivities(transactionsRaw, categories);
        const baselineTotal = walletsRaw.reduce((sum, wallet) => sum + (wallet.default_balance || wallet.current_balance || 0), 0);
        const lastSnapshot = activities[0]?.time ?? "Chưa có giao dịch";

        return {
            wallets,
            activities,
            quickActions,
            summary: formatSummary(wallets, baselineTotal, lastSnapshot)
        };
    }
}

export default WalletService;

