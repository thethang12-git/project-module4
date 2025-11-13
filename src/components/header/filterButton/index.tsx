import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function FilterButton({title}:any) {
    return (
        <Autocomplete
            style={{ width: "20%" }}
            disablePortal
            options={[]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={title}
                />
            )}
        />
    );
}
