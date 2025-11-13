"use client"
import React from "react";
import SideBar from "@/src/components/sidebar";
import Header from "@/src/components/header";

export default function HomeLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <>
        <div className="home-layout flex flex-col min-h-screen overflow-hidden">
            <Header/>
            <hr style={{ border: "none", borderBottom: "1px solid gray" }} />
            {children}
        </div>
        </>

    );
}
