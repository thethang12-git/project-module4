"use client";
import UserService from "@/src/service/dataService";
import { RootState } from "@/src/store/store";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { useEffect, useState } from "react";
import { Bar, Pie } from 'react-chartjs-2';
import { useSelector } from "react-redux";
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function ChartPopup({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [mode,setMode] = useState<any>('Vertical Chart');
    const [animation,setAnimation] = useState<boolean>(false);
    useEffect(() => {
        if(open) {setTimeout(() => setAnimation(true), 100);}
        else {setAnimation(false);}
    }, [open]);
    const [monthlyData, setMonthlyData] = useState<any>([]);
    useEffect(() => {
        const getId = JSON.parse(localStorage.getItem("userId")||"null");
        if(getId){
            if(mode == 'Vertical Chart'){ 
                for(let month=0; month<12; month++){
                UserService.getTransactionsByMonth(getId,month+1,new Date().getFullYear())
                    .then((res) => {
                        let inflow = 0;
                        let outflow = 0;
                        res.forEach((curr:any) => {
                            if(curr.money > 0) inflow += curr.money;
                            else outflow += curr.money;
                        });
                        setMonthlyData(
                            (prev: any) => {
                                const newData = [...prev];
                                newData[month] = { inflow, outflow };
                                return newData;
                            }
                        );
                    });
            }
            }
            else if (mode == 'Horizontal Chart'){
                console.log("Horizontal Chart")
            }
        }
    }, [mode]);

    if (!open) return null;

    const handleClose = () => {
        setAnimation(false);
        setTimeout(() => onClose(), 300);
    }
    const transactions = useSelector((state: RootState) => state.transactions.list);

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July',
        'Aug', 'Sept', 'Oct', "Nov", "Dec"
    ];
    const data 
    = mode === 'Vertical Chart' && {
        labels,
        datasets: [
            {
                label: 'Inflow',
                data: monthlyData.map((itm: any) => itm?.inflow || 0),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Outflow',
                data: monthlyData.map((itm: any) => itm?.outflow || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    } 
    ||  mode === 'Pie Chart' && {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }
    const options = {
        scales: {
            y: {
                min: -1000000,
                max: 1000000,
            }
        },
        responsive: true,
        plugins: {
            legend: { position: 'top' as const},
            title: {
                display: true,
                text: mode,
                font: { size: 18 }
            },
        },
    };

    return (
        <div
            style={{opacity: animation ? '1' : '0', transition: 'all 0.3s ease-in-out'}}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleClose}
        >
            <div
                style={{ transform: animation ? 'scale(1)' : 'scale(0)', transition: 'all 0.4s ease-in-out'}}
                className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-3xl h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Statistics</h2>
                    <button
                        className="text-red-500 font-bold text-lg"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Chart */}
                {mode === 'Vertical Chart' && (
                <div className="flex-1">
                    <Bar options={options}  data={data} />
                </div>
                )}
                {mode === 'Pie Chart' && (
                <div className="flex-1">
                    <Pie data={data}></Pie>
                </div>
                )}
            </div>
        </div>
    );
}

