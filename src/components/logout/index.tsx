"use client"
import Button from '@mui/material/Button';
import Popup from "@/src/components/popUp";
import React from "react";
import {useRouter} from "next/navigation";
import LoadingPageAnimation from "@/src/components/backdrop_loading";

export default function LogoutButton() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const handleLogout = () => {
        localStorage.clear();
        setOpen(true);
        setTimeout(() => {
            router.push("/login");
        }, 2000);
    }

    return (
        <>
            <Button onClick={handleLogout} color={"error"} style={{height:'auto',marginBottom:'0.5rem'}} variant="contained" >
                Đăng xuất
            </Button>
            <Popup
                open={open}
                message="Đăng xuất thành công!"
                onClose={() => setOpen(false)}
            />
            <LoadingPageAnimation open={open} setOpen={setOpen}/>
        </>
    );
}
