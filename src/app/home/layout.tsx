import React from "react";
import SideBar from "@/src/components/sidebar";

export default function HomeLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <div className="home-layout flex flex-row min-h-screen">
            <SideBar />
            {children}
        </div>
    );
}
