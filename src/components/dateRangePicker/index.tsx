"use client"
import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {Dayjs} from "dayjs";
import {HiOutlineCalendar} from "react-icons/hi";
import UserService from "@/src/service/dataService";


export default function DateRangePicker({setTransaction}: any) {
    const [start, setStart] = useState<Dayjs | null>(null);
    const [end, setEnd] = useState<Dayjs | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const handleSubmit = async () => {
        setAnchorEl(null);

        // Format ngày YYYY-MM-DD
        const startDate = start ? start.format('YYYY-MM-DD') : null;
        const endDate = end ? end.format('YYYY-MM-DD') : null;

        console.log('Start:', startDate, 'End:', endDate);

        // Lấy userId từ localStorage
        const userIdStr = localStorage.getItem('userId');
        if (!userIdStr) return;

        const userId = JSON.parse(userIdStr);

        try {
            const response = await UserService.getTransactionsByMonth(userId, '10', '2024');
            console.log('API response:', response.data);
            if (setTransaction) setTransaction(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" flexDirection="column">
                <button
                    onClick={handleClick}
                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md group"
                    aria-label="Calendar"
                >
                    <HiOutlineCalendar className="text-xl text-gray-600 group-hover:text-blue-600 transition-colors"/>
                </button>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                >
                    <Paper sx={{p: 2, display: 'flex', gap: 1}}>
                        <DatePicker
                            label="Start"
                            value={start}
                            onChange={(newValue) => setStart(newValue)}
                        />
                        <DatePicker
                            label="End"
                            value={end}
                            onChange={(newValue) => setEnd(newValue)}
                        />
                        <Button variant="contained" onClick={() => {
                            setAnchorEl(null);
                            handleSubmit();
                        }}>
                            Xong
                        </Button>
                    </Paper>
                </Popover>
            </Box>
        </LocalizationProvider>
    );
}
