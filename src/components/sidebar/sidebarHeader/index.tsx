"use client";
import Avatar from '@mui/material/Avatar';
import {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import  { setUser} from "@/src/store/slices/user";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Typography } from "@mui/material";
export default function SideBarUser() {
    const userStored = useAppSelector((state) => state.user.value);
    const [avatar, setAvatar] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [currentEmail,setEmail] = useState("");
    useEffect(() => {
        const user = localStorage.getItem("user");
        const email = localStorage.getItem("email");
        const avatar = localStorage.getItem("avatar");
        if(user && email)  {
            dispatch(setUser(JSON.parse(user)));
            setEmail(email);
            if (avatar) {
                setAvatar(JSON.parse(avatar));
            }
        }
    }, []);
    return (
        <div style={{display: "flex",flexDirection:'column',marginTop:10}}>
            <Avatar
                style={{display:"flex", justifyContent:"center",alignSelf:"center"}}
                alt="Remy Sharp"
                src= {avatar || 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_2_5_638427405635366659_avt-cho-cute.jpg'}
                sx={{ width: 56, height: 56}}
            />
            <Offcanvas.Header style={{display:"flex", justifyContent:"center",padding:'0'}}>
                <Offcanvas.Title>
                    {userStored}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Typography style={{display:"flex", justifyContent:"center",alignSelf:"center"}}  variant="body2" fontStyle="italic" color="text.secondary">
                {currentEmail}
            </Typography>
        </div>
    );
}
