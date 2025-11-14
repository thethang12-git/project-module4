"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from "react-bootstrap/Offcanvas";
import {useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Button from '@mui/material/Button';
import SidebarHeader from './sidebarHeader'
import SideBarBody from "@/src/components/sidebar/sidebarBody";
import LogoutButton from "@/src/components/logout";
export default function SideBar() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button onClick={handleShow} style={{height:"40px",width:"fit-content",padding:'0',marginTop:'1rem'}}  >
                <GiHamburgerMenu style={{width:"100%",height:"100%"}} />
            </Button>
            <Offcanvas show={show} onHide={handleClose} style={{display:'flex',flexDirection:'column',transition:'all 0.5s', width: "20rem" }} >
                <SidebarHeader></SidebarHeader>
                <SideBarBody></SideBarBody>
                <LogoutButton/>
            </Offcanvas>
        </>
    );
}
