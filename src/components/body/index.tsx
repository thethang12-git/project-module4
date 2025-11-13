"use client"
import React, {useEffect} from "react";

export default function Body({list}: any) {
    useEffect(() => {
        console.log("Danh sách sidebarHeader:", list);
    }, [list]);
    return (
        <div>Dữ liieuej của BoDY ở đây</div>
    );
}
