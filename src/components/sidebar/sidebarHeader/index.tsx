"use client";
import Avatar from '@mui/material/Avatar';
import {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import  { setUser} from "@/src/store/slices/user";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Typography } from "@mui/material";
export default function SideBarUser() {
    const userStored = useAppSelector((state) => state.user.value);
    const dispatch = useAppDispatch();
    const [currentEmail,setEmail] = useState("");
    useEffect(() => {
        const user = localStorage.getItem("user");
        const email = localStorage.getItem("email");
        if(user && email)  {
            dispatch(setUser(JSON.parse(user)));
            setEmail(email);
        }
    }, [userStored]);
    return (
        <div style={{display: "flex",flexDirection:'column',marginTop:10}}>
            <Avatar
                style={{display:"flex", justifyContent:"center",alignSelf:"center"}}
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
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
