"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import {useRouter} from "next/navigation";

export default function SideBarBody() {
    const router = useRouter();
    return (
        <>
                <Offcanvas.Body>
                    <div style={{display:"flex",flexDirection:'column'}}>
                        <Button
                            onClick={()=> router.push("/")}
                            fullWidth
                            startIcon={<PersonIcon/>}
                            style={{color:'gray',display:"flex", justifyContent:"left", alignItems:"center"}}
                        >
                            <p style={{margin: '0',marginTop:'3px',marginLeft:'10px'}}>My account</p>
                        </Button>
                        <Button
                            onClick={()=> router.push("/wallets")}
                            fullWidth
                            startIcon={<AccountBalanceWalletIcon/>}
                            style={{display:"flex", justifyContent:"left", alignItems:"center",color:'gray'}}
                        >
                            <p style={{margin: '0',marginTop:'3px',marginLeft:'10px'}}>My Wallets</p>
                        </Button>
                        <Button
                            onClick={()=> router.push("/categories")}
                            fullWidth
                            startIcon={<CategoryIcon/>}
                            style={{display:"flex", justifyContent:"left", alignItems:"center",color:'gray'}}
                        >
                            <p style={{margin: '0',marginTop:'3px',marginLeft:'10px'}}>Categories</p>
                        </Button>
                    </div>
                </Offcanvas.Body>
        </>
    );
}
