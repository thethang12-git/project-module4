"use client"
import Offcanvas from "react-bootstrap/Offcanvas";
import {useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Button from '@mui/material/Button';
import SidebarHeader from './sidebarHeader'
import SideBarBody from "@/src/components/sidebar/sidebarBody";
import LogoutButton from "@/src/components/logout";
import { Avatar } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
export default function SideBar({avatar}:any) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Avatar
                onClick={handleShow}
                style={{display:"flex", justifyContent:"center",alignSelf:"center"}}
                alt="user avatar"
                src= { avatar || 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/2024_2_5_638427405635366659_avt-cho-cute.jpg'}
                sx={{ width: '100%', height: '100%' }}
            />
            {/*<Button onClick={handleShow} style={{height:"40px",width:"fit-content",padding:'0',marginTop:'1rem'}}  >*/}
            {/*    <GiHamburgerMenu style={{width:"100%",height:"100%"}} />*/}
            {/*</Button>*/}
            <Offcanvas show={show} onHide={handleClose} style={{display:'flex',flexDirection:'column',transition:'all 0.5s', width: "20rem" }} >
                <SidebarHeader></SidebarHeader>
                <SideBarBody></SideBarBody>
                <LogoutButton/>
            </Offcanvas>
        </>
    );
}
