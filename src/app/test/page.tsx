'use client';
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Paper from '@mui/material/Paper';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Dayjs} from "dayjs";

export default function Test() {
    const [start, setStart] = useState<Dayjs | null>(null);
    const [end, setEnd] = useState<Dayjs | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" flexDirection="column" gap={2}>
                <Button variant="contained" onClick={handleClick}>
                   Button
                </Button>

                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Paper sx={{ p: 2, display: 'flex', gap: 1 }}>
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
                        <Button variant="contained" onClick={() => setAnchorEl(null)}>
                            Xong
                        </Button>
                    </Paper>
                </Popover>
            </Box>
        </LocalizationProvider>
    );
}
