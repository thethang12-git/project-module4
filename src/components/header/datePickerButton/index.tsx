import { useState } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import dayjs from "dayjs";

export default function DatePickerButton() {
    const [chooseDate, setChooseDate] = useState<[Date | null, Date | null] | null>(null);

    const handleChange = (value: [Date | null, Date | null] | null) => {
        setChooseDate(value);
    };

    return (
        <div style={{ width: 300 }}>
            <DateRangePicker
                placement={"autoVertical"}
                size={"lg"}
                style={{ scale: '1.3',marginTop:'0.5rem'}}
                onChange={handleChange}
                format="dd-MM-yyyy"
                placeholder="Select date range"
                renderValue={(value) => {
                    if (!value || !value[0] || !value[1]) return "";
                    return `${dayjs(value[0]).format("DD-MM-YYYY")} - ${dayjs(value[1]).format("DD-MM-YYYY")}`;
                }}
            />
        </div>
    );
}
