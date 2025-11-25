"use client"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import UserService from "@/src/service/dataService";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Switch from '@mui/material/Switch';
import CloseButton from 'react-bootstrap/CloseButton';
// function randomColor() {
//     const r = Math.floor(Math.random() * 256);
//     const g = Math.floor(Math.random() * 256);
//     const b = Math.floor(Math.random() * 256);
//     return `rgba(${r}, ${g}, ${b}, 0.2)`; // Màu nền với độ mờ
// }
//
// function randomBorderColor() {
//     const r = Math.floor(Math.random() * 256);
//     const g = Math.floor(Math.random() * 256);
//     const b = Math.floor(Math.random() * 256);
//     return `rgba(${r}, ${g}, ${b}, 1)`; // Màu viền không mờ
// }
export default function PieChart({ open, onClose,setSwitch,switchState }: { open: boolean, onClose: () => void, setSwitch: React.Dispatch<React.SetStateAction<boolean>>, switchState: boolean }) {
ChartJS.register(ArcElement, Tooltip, Legend);
    const [animation,setAnimation] = useState<boolean>(false);
    const [Categories, setCategories] = useState<any>([]);
    const transactions = useSelector((state: any) => state.transactions.list);
    useEffect(() => {
        if(open) {setTimeout(() => setAnimation(true), 100);}
        // else {setAnimation(false);}
    }, [open]);
    useEffect(() => {
        const getId = JSON.parse(localStorage.getItem("userId")||"null");
        if(getId) {
            UserService.getCategories(getId)
            .then((res) => {
                const newCategories = res.data.map((cat:any) => ({
                    name: cat.name,
                    value: 0,
                    id: cat.id
                }));
                transactions.forEach((item: any) => {
                    const index = newCategories.findIndex((c: any) => Number(c.id) === Number(item.categoryId));
                    if (index !== -1) {
                    newCategories[index].value += item.money;
                }
                });
            setCategories(newCategories);
            });
        }
    }, []);
    if (!open) return null;

    const handleClose = () => {
        setAnimation(false);
        setTimeout(() => onClose(), 300);
    }
const data = {
  labels: Categories.map((itm: any) => itm.name),
  datasets: [
    {
      label: 'Amount',
      data: Categories.map((itm: any) => itm.value),
      // backgroundColor: Array.from({ length: Categories.length }, randomColor),
      // borderColor : Array.from({ length: Categories.length }, randomColor),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 71, 0.2)',
          'rgba(100, 149, 237, 0.2)',
          'rgba(60, 179, 113, 0.2)',
          'rgba(255, 215, 0, 0.2)',
          'rgba(221, 160, 221, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 71, 1)',
          'rgba(100, 149, 237, 1)',
          'rgba(60, 179, 113, 1)',
          'rgba(255, 215, 0, 1)',
          'rgba(221, 160, 221, 1)'
      ],
      borderWidth: 1,
    },
  ],
};
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const},
            title: {
                display: true,
                text: 'Pie Bar Chart',
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
                    onChange={(e) => setSwitch(e.target.checked)}
                />
                <CloseButton onClick={handleClose} />
            </div>
        </div>
        {/* Chart */}
        <div className="flex-1 flex items-center justify-center">
            <Pie data={data} options={options}/>
        </div>
    </div>
</div>
    )
}
