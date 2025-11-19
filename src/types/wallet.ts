export type Wallet = {
    id: string;
    name: string;
    type: "cash" | "card" | "savings";
    balance: number;
    limit?: number;
    currency: string;
    trend: "up" | "down";
    change: number;
    lastUpdated: string;
};

export type WalletActivity = {
    id: string;
    label: string;
    amount: number;
    category: string;
    direction: "income" | "expense";
    time: string;
};

export type WalletQuickAction = {
    label: string;
    description: string;
    color: string;
};

export type WalletSummary = {
    totalBalance: number;
    totalWallets: number;
    positiveWallets: number;
    negativeWallets: number;
    growthRate: number;
    lastSnapshot: string;
};

export type WalletDashboardData = {
    wallets: Wallet[];
    activities: WalletActivity[];
    quickActions: WalletQuickAction[];
    summary: WalletSummary;
};

export type WalletApiModel = {
    id: string;
    userId: number;
    icon?: string;
    name: string;
    default_balance: number;
    current_balance: number;
};

export type TransactionApiModel = {
    id: string;
    userId: number;
    name: string;
    money: number;
    categoryId: number;
    walletId: number;
    date: string;
    note?: string;
};

export type CategoryApiModel = {
    id: string;
    userId: number;
    name: string;
    is_income: boolean;
};

