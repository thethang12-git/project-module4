"use client";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

export default function Popup({ open, message, onClose }: any) {

    return (
        <Snackbar
            open={open}
            message={message}
            autoHideDuration={2000}
            onClose={onClose}
            TransitionComponent={(props) => <Slide {...props} direction="down" />}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        />
    );
}
