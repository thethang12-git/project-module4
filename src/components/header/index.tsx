"use client"
import Search from "./search";
import FilterButton from "@/src/components/header/filterButton";
import SideBar from "@/src/components/sidebar";
import React from "react";
import TotalWallets from "@/src/components/header/total&addTransaction/total";
import AddTransactionButton from "@/src/components/header/total&addTransaction/addTransaction";
import DatePickerButton from "@/src/components/header/datePickerButton";

export default function Header() {
    return (
        <>
                <div style={{width: "100%" , display: "flex" ,flexDirection: "row" }}  >
                    <SideBar />
                    <Search/>
                </div>
                <div style={{width: "100%" , display: "flex" ,flexDirection: "row",justifyContent: "space-evenly" ,marginTop:'1rem'}}  >
                    <FilterButton title={'Wallet, truyền dữ liệu ở đây'}/>
                    <FilterButton title={'Categories, truyền dữ liệu ở đây'}/>
                    <DatePickerButton/>
                </div>
                <div style={{width:'100%',display: "flex" ,flexDirection: "row",justifyContent:"space-between",padding:'0 20px',marginTop:'20px'}}>
                    <TotalWallets/>
                    <AddTransactionButton/>
                </div>
        </>

    );
}
