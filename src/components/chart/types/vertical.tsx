"use client";
import UserService from "@/src/service/dataService";
import Switch from "@mui/material/Switch";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from "react";
import CloseButton from "react-bootstrap/esm/CloseButton";
import { Bar } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function VerticalChart({ open, onClose,setSwitch,switchState }: { open: boolean, onClose: () => void, setSwitch: React.Dispatch<React.SetStateAction<boolean>>, switchState: boolean }) {
    const [animation,setAnimation] = useState<boolean>(false);
    const [monthlyData, setMonthlyData] = useState<any>([]);
    const [maxValue, setMaxValue] = useState<number>(0);
    const [minValue, setMinValue] = useState<number>(0);
    let localMax = 0;
    let localMin = 0;
    useEffect(() => {
        if(open) {setTimeout(() => setAnimation(true), 100);}
        else {setAnimation(false);}
    }, [open]);
    useEffect(() => {
        const getId = JSON.parse(localStorage.getItem("userId")||"null");
        if(getId) {
            for(let month=0; month<12; month++){
                UserService.getTransactionsByMonth(getId,month+1,new Date().getFullYear())
                    .then((res) => {
                        let inflow = 0;
                        let outflow = 0;
                        res.forEach((curr:any) => {
                            if(curr.money > 0) {
                                inflow += curr.money;
                                if(inflow > localMax) {localMax = inflow;}
                            }
                            else {
                                outflow += curr.money;
                                if(outflow < localMin) {localMin = outflow;}
                            }
                        });
                        setTimeout(() =>
                                setMonthlyData(
                                    (prev: any) => {
                                        const newData = [...prev];
                                        newData[month] = { inflow, outflow };
                                        return newData;
                                    })
                            ,200)

                        setMaxValue(prev => Math.max(prev, localMax));
                        setMinValue(prev => Math.min(prev, localMin));
                    });                        
                }
            }}, []);    
            
    if (!open) return null;

    const handleClose = () => {
        setAnimation(false);
        setTimeout(() => onClose(), 300);
    }
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July','Aug', 'Sept', 'Oct', "Nov", "Dec"];
    const data = {
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
    const options = {
        scales: {
            y: {
                min: -Math.abs(minValue),
                max: maxValue,
            }
        },
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const},
            title: {
                display: true,
                text: 'Vertical Bar Chart',
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
                    <div>
                        {switchState ? <span style={{fontWeight:'500'}}>Pie Chart</span> : <span style={{fontWeight:'500'}}>Vertical Chart</span>}
                        <Switch
                            checked={switchState}
                            onChange={(e) => setSwitch(e.target.checked)}/>
                    <CloseButton onClick={handleClose} />
            </div>
                </div>

                {/* Chart */}
                <div className="flex-1">
                    <Bar options={options}  data={data} />
                </div>
            </div>
        </div>
    );
}

