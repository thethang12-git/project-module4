'use client';
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {useRouter} from "next/navigation";
import  {resetUser, setUser} from "@/src/store/slices/user";
import 'bootstrap/dist/css/bootstrap.min.css';
export default function Counter() {
    const router = useRouter();
    const user = useAppSelector((state) => state.user.value);
    const dispatch = useAppDispatch();

    return (
        <div>
            <h1>User: {user}</h1>
            <Button variant={"outlined"} style={{height:"fit-content"}} onClick={() => dispatch(resetUser())}>Reset tên user </Button>
            <Button variant={"outlined"} style={{height:"fit-content"}} onClick={() =>router.push("/") }> chuyển trang home </Button>
        </div>
    );
}
