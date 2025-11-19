"use client"
import HeaderHome from "@/src/components/home/HeaderHome"
import SummaryCard from "@/src/components/home/SummaryCard"
import DateCard from "@/src/components/home/DateCard"
import TransactionList from "@/src/components/home/transactionList"
import {useEffect, useRef, useState } from "react"
import UserService from "@/src/service/dataService"

export default function HomePage() {
    const [transactions,setTransaction] = useState<any[]>([])
    const [monthData,setMonthData] = useState<any[]>([])
    const [inFlow,setInFlow] = useState<number>(0)
    const [outFlow,setOutFlow] = useState<number>(0)
    const [total,setTotal] = useState<number>(0)
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthMap: { [key: string]: string } = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
    };
    const todayDate = new Date();
    const [day, setDay] = useState({
        day: todayDate.getDate(),
        month: monthNames[todayDate.getMonth()],
        year: todayDate.getFullYear(),
        weekday: todayDate.toLocaleDateString('en-US', { weekday: 'long' }) 
    });
// get transaction by date
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if(userId) {
            const trueId = JSON.parse(userId);
            const formattedDate = `${day.year}-${monthMap[day.month]}-${String(day.day).padStart(2, '0')}`;
            UserService.getTransactionsByDate(trueId,formattedDate).then( res => {
            // load transactions from DB
            setTransaction(res.data)
            const transactions= res.data
            // calculate total
            const totall = transactions.reduce((acc:number,value : any)=> {
                return acc += parseFloat(value.money)
            },0)
            setTotal(totall)
            // 
            console.log('kiểm tra xem useEffect có chạy nhiều lần không')
        }).catch( err => {
            console.log(err);
        } )
    }
    }, [day])
    // Get transactions by month
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if(userId){
            const trueId = JSON.parse(userId);
            UserService.getTransactionsByMonth(trueId,monthMap[day.month],day.year)
            .then(res => {
                setMonthData(res.data)
                // lọc để cập nhật inflow, outflow
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
                console.log(res.data) })   
            .catch(err => 
                console.log(err))
        }
        },[day.month,day.year]);
    return (
        <>
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
                {/* Decorative background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
                </div>
                {/* Header */}
                <HeaderHome setTransactions={setTransaction}/>

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


