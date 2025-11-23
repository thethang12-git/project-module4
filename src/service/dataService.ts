import axios from "axios";
import { DEFAULT_CATEGORIES } from "../constants/defaultCategories";

const normalizeUserId = (userId: any) => {
    if (userId === null || userId === undefined) return undefined;
    return typeof userId === "string" ? userId : String(userId);
};

class UserService {
    static async getData() {
        return await axios.get("http://localhost:3001/users");
    }

    static async validateUser(email: string, password?: string) {
        try {
            const params: Record<string, string> = { username: email };
            if (typeof password === "string" && password.length > 0) {
                params.password = password;
            }
            const res = await axios.get("http://localhost:3001/users", { params });
            return res.data?.[0] || undefined;
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    static async addUser(user: any) {
        const generatedId =
            user?.id ||
            (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : Date.now().toString());

        const newUser: any = {
            ...user,
            id: generatedId,
            username: user.email,
        };

        delete newUser.email;
        if ("OTP" in newUser) {
            delete newUser.OTP;
        }

        return await axios.post("http://localhost:3001/users", newUser);
    }

    static async getTransactions(userID: any) {
        const userId = normalizeUserId(userID);
        return await axios.get(`http://localhost:3001/transactions/`, { params: { userId } });
    }

    static async getTransactionsByDate(userID: any, date: string) {
        const userId = normalizeUserId(userID);
        return await axios.get("http://localhost:3001/transactions", { params: { userId, date } });
    }

    static async getTransactionsByMonth(userID: any, month: any, year: any) {
        const userId = normalizeUserId(userID);
        return await axios.get("http://localhost:3001/transactions", {
            params: { userId, startDate: `${year}-${month}-01`, endDate: `${year}-${month}-30` },
        });
    }

    static async getWallets(userID: any) {
        const userId = normalizeUserId(userID);
        return await axios.get("http://localhost:3001/wallets", { params: { userId } });
    }

    static async createWallet(wallet: any) {
        const payload = {
            ...wallet,
            userId: normalizeUserId(wallet.userId),
        };
        return await axios.post("http://localhost:3001/wallets", payload);
    }

    static async updateWallet(walletId: any, updates: any) {
        if (!walletId) {
            throw new Error("walletId is required to update wallet");
        }
        return await axios.patch(`http://localhost:3001/wallets/${walletId}`, updates);
    }

    static async deleteWallet(walletId: any) {
        if (!walletId) {
            throw new Error("walletId is required to delete wallet");
        }
        return await axios.delete(`http://localhost:3001/wallets/${walletId}`);
    }

    static async deleteTransactionsByWallet(walletId: any) {
        if (!walletId) {
            throw new Error("walletId is required to delete transactions");
        }
        const response = await axios.get("http://localhost:3001/transactions", { params: { walletId } });
        const transactions = Array.isArray(response.data) ? response.data : [];

        await Promise.all(
            transactions.map((transaction: any) =>
                axios.delete(`http://localhost:3001/transactions/${transaction.id}`),
            ),
        );

        return transactions.length;
    }

    static async deleteWalletAndTransactions(walletId: any) {
        if (!walletId) {
            throw new Error("walletId is required to delete wallet and transactions");
        }
        await this.deleteTransactionsByWallet(walletId);
        return await this.deleteWallet(walletId);
    }

    static async createTransaction(transaction: any) {
        if (!transaction) {
            throw new Error("transaction payload is required");
        }

        const generatedId =
            transaction?.id ||
            (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
                ? crypto.randomUUID()
                : Date.now().toString());

        const payload = {
            ...transaction,
            id: generatedId,
            userId: normalizeUserId(transaction.userId),
            date: transaction.date || new Date().toISOString().slice(0, 10),
        };

        return await axios.post("http://localhost:3001/transactions", payload);
    }

    static async getCategories(userID: any) {
        const userId = normalizeUserId(userID);
        const response = await axios.get("http://localhost:3001/categories", { params: { userId } });
        
        // Merge default categories with user categories
        const userCategories = Array.isArray(response.data) ? response.data : [];
        const allCategories = [...DEFAULT_CATEGORIES, ...userCategories];
        
        return {
            ...response,
            data: allCategories,
        };
    }
}
export default UserService;