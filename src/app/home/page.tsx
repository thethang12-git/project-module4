"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {useRouter} from "next/navigation";
import  { setUser} from "@/src/store/slices/user";
import Body from "@/src/components/body";
export default function Home() {
    const router = useRouter();
    const userStored = useAppSelector((state) => state.user.value);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if(user){
            dispatch(setUser(JSON.parse(user)));
        }
    }, [userStored]);

    return (
        <Body/>
    );
}
