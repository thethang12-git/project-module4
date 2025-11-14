import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TransactionList from "@/src/components/transactionList";

export default function Body() {
    const [value, setValue] = React.useState('one');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="wrapped label tabs example"
                    variant="fullWidth"
                >
                    <Tab value="one" label="Last Month"  sx={{ textTransform: 'none' }} />
                    <Tab value="two" label="This Month"  sx={{ textTransform: 'none' }} />
                    <Tab value="three" label="Future"  sx={{ textTransform: 'none' }} />
                </Tabs>
            </Box>
            <TransactionList/>
        </div>
    );
}
