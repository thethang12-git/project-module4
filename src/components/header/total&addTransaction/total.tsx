import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LanguageIcon from '@mui/icons-material/Language';
const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export default function TotalWallets() {
    return (
        <>
            <Button sx={{ textTransform: "none" }} style={{padding:'0',height:'fit-content'}} >
                <Card style={{width:'100%',padding:'0 20px'}}>
                    <div style={{width:'100%',display:'flex',flexDirection:'row',gap:'20px'}}>
                        <LanguageIcon style={{alignSelf:'center',scale:'1.5'}}/>
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <h6 style={{textAlign:'left',margin:'0'}}>Total <ArrowDropDownIcon style={{margin:'-6px 0 0 0'}}/> </h6>
                            <p style={{margin:'0'}}>Hiển thị số dư ở đây</p>
                        </div>
                    </div>
                </Card>
            </Button>
        </>
    );
}
