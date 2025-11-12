"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from "react-bootstrap/Offcanvas";
import {useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
export default function SideBar() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button onClick={handleShow} style={{height:"fit-content",width:"fit-content"}} variant="outlined" >
                <GiHamburgerMenu/>
            </Button>
            <Offcanvas show={show} onHide={handleClose} style={{transition:'all 0.5s', width: "20rem" }} >
                <Offcanvas.Header style={{display:"flex", justifyContent:"center"}}>
                    <Offcanvas.Title>User</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div style={{display:"flex",flexDirection:'column'}}>
                        <Button
                            fullWidth
                            startIcon={<PersonIcon/>}
                            style={{color:'gray',display:"flex", justifyContent:"left", alignItems:"center"}}
                        >
                            <p style={{margin: '0',marginTop:'3px',marginLeft:'10px'}}>My account</p>
                        </Button>
                        <Button
                            fullWidth
                            startIcon={<AccountBalanceWalletIcon/>}
                            style={{display:"flex", justifyContent:"left", alignItems:"center",color:'gray'}}
                        >
                            <p style={{margin: '0',marginTop:'3px',marginLeft:'10px'}}>My Wallets</p>
                        </Button>
                        <Button
                            fullWidth
                            startIcon={<CategoryIcon/>}
                            style={{display:"flex", justifyContent:"left", alignItems:"center",color:'gray'}}
                        >
                            <p style={{margin: '0',marginTop:'3px',marginLeft:'10px'}}>Categories</p>
                        </Button>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
