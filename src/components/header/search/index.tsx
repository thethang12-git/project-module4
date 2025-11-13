
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Search() {
    return (
        <Autocomplete
            disablePortal
            fullWidth
            options={[]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="search for transaction"
                    variant="standard"
                />
            )}
        />
    );
}
