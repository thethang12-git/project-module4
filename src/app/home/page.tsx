"use client"
import HeaderHome from "@/src/components/home/HeaderHome"
import SummaryCard from "@/src/components/home/SummaryCard"
import DateCard from "@/src/components/home/DateCard"
import TransactionList from "@/src/components/home/transactionList"
import { useCallback, useEffect, useState } from "react"
import UserService from "@/src/service/dataService"

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const MONTH_MAP: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12"
}

export default function HomePage() {
    const [transactions,setTransaction] = useState<any[]>([])
    const [monthData,setMonthData] = useState<any[]>([])
    const [inFlow,setInFlow] = useState<number>(0)
    const [outFlow,setOutFlow] = useState<number>(0)
    const [total,setTotal] = useState<number>(0)
    const [wallets, setWallets] = useState<any[]>([])
    const [recentWallet, setRecentWallet] = useState<any | null>(null)
    const [walletLoading, setWalletLoading] = useState<boolean>(false)
    const todayDate = new Date();
    const [day, setDay] = useState({
        day: todayDate.getDate(),
        month: MONTH_NAMES[todayDate.getMonth()],
        year: todayDate.getFullYear(),
        weekday: todayDate.toLocaleDateString('en-US', { weekday: 'long' }) 
    });

    const fetchTransactionsForSelectedDay = useCallback(async () => {
        const userId = localStorage.getItem("userId");
        if(!userId) return;
        const trueId = JSON.parse(userId);
        const formattedDate = `${day.year}-${MONTH_MAP[day.month]}-${String(day.day).padStart(2, '0')}`;
        try {
            const res = await UserService.getTransactionsByDate(trueId,formattedDate);
            setTransaction(res.data);
            const totall = res.data.reduce((acc:number,value : any)=> {
                return acc += parseFloat(value.money)
            },0)
            setTotal(totall)
        } catch (err) {
            console.log(err);
        }
    }, [day.day, day.month, day.year])

    const fetchTransactionsForMonth = useCallback(async () => {
        const userId = localStorage.getItem("userId");
        if(!userId) return;
        const trueId = JSON.parse(userId);
        try {
            const res = await UserService.getTransactionsByMonth(trueId,MONTH_MAP[day.month],day.year)
            setMonthData(res.data)
            const value = res.data.reduce(
                (acc: any, transaction:any) => {
                    const amount = parseFloat(transaction.money)
                    if(amount > 0) {
                        acc.inflow += amount
                    }
                    else {
                        acc.outflow += amount
                    }
                    return acc
                },{inflow : 0,outflow :0}
            )
            setInFlow(value.inflow)
            setOutFlow(value.outflow)
        } catch (err) {
            console.log(err)
        }
    }, [day.month, day.year])

    const fetchWallets = useCallback(async () => {
        const userId = localStorage.getItem("userId");
        if(!userId) return;
        const trueId = JSON.parse(userId);
        setWalletLoading(true);
        try {
            const res = await UserService.getWallets(trueId);
            setWallets(res.data ?? []);
        } catch (err) {
            console.log(err);
        } finally {
            setWalletLoading(false);
        }
    }, []);

// get transaction by date
    useEffect(() => {
        fetchTransactionsForSelectedDay()
    }, [fetchTransactionsForSelectedDay])
    // Get transactions by month
    useEffect(() => {
        fetchTransactionsForMonth()
        },[fetchTransactionsForMonth]);
    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    const handleWalletCreated = (wallet: any) => {
        setWallets(prev => [wallet, ...prev]);
        setRecentWallet(wallet);
    };

    const handleWalletUpdated = (updatedWallet: any) => {
        setWallets(prev => prev.map(wallet => (wallet.id === updatedWallet.id ? updatedWallet : wallet)));
        setRecentWallet(updatedWallet);
    };

    const handleTransactionCreated = useCallback(() => {
        fetchTransactionsForSelectedDay()
        fetchTransactionsForMonth()
        fetchWallets() // Fetch lại wallets để cập nhật số dư
    }, [fetchTransactionsForMonth, fetchTransactionsForSelectedDay, fetchWallets])

    const handleWalletDeleted = (walletId: string | number) => {
        setWallets((prev: any[]) => prev.filter(wallet => wallet.id !== walletId));
        setRecentWallet((prev: any | null) => (prev?.id === walletId ? null : prev));
        handleTransactionCreated();
    };

    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
                {/* Decorative background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
                </div>
                {/* Header */}
                <HeaderHome
                    total={total}
                    setTransaction={setTransaction}
                    onWalletCreated={handleWalletCreated}
                    onWalletUpdated={handleWalletUpdated}
                    onWalletDeleted={handleWalletDeleted}
                    onTransactionCreated={handleTransactionCreated}
                    wallets={wallets}
                    recentWallet={recentWallet}
                />

                {/* Main Content */}
                <div className="relative container mx-auto px-6 py-10 max-w-6xl">
                    <div className="space-y-8">
                        {/* Summary Card */}
                        <SummaryCard inFlow={inFlow} outFlow={outFlow} />

                        {/* Date Card */}
                        <DateCard day= {day} total={total}/>
                    </div>
                    <TransactionList transactions={transactions} />
                </div>
            </div>
        </>

    )
}


