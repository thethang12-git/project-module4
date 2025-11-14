"use client";

import {useRouter} from "next/navigation";
import Body from "@/src/components/body";

export default function Home() {
    const router = useRouter();
    return (
        <Body/>

    );
}
