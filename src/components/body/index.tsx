"use client"
import React, {useEffect} from "react";

export default function Body({list}: any) {
    useEffect(() => {
        console.log("Danh sách user:", list);
    }, [list]);
    return (
        <div>Gọi dữ liệu từ test để hiển thị dữ liệu transactions trong component/body</div>
    );
}
