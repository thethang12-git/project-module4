"use client"
import SideBar from "@/src/components/sidebar";
import React from "react";

export default function Header() {
    return (
        <>
                <div style={{width: "100%" , display: "flex" ,flexDirection: "row" }}  >
                    <SideBar />
                </div>
        </>

    );
}
