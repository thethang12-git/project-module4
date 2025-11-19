"use client"
import { FiGlobe } from "react-icons/fi"
import { HiOutlineCalendar } from "react-icons/hi"
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2"
import { HiOutlineMagnifyingGlass } from "react-icons/hi2"
import { HiChevronDown } from "react-icons/hi"
import Avatar from '@mui/material/Avatar';
import {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import  { setUser} from "@/src/store/slices/user";
import SideBar from "../sidebar"
import SearchModal from "@/src/components/search";
import DateRangePicker from "@/src/components/dateRangePicker";

export default function HeaderHome({setTransaction} :any) {
    const [avatar, setAvatar] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        const user = localStorage.getItem("user");
        const email = localStorage.getItem("email");
        const avatar = localStorage.getItem("avatar");
        if(user && email)  {
            dispatch(setUser(JSON.parse(user)));
            if (avatar) {
                setAvatar(JSON.parse(avatar));
            }
        }
    }, []);
    return (
        <>
            <div className="w-full bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200/50 shadow-sm backdrop-blur-sm px-6 py-5 sticky top-0 z-50">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Left side - Total box */}
                    <div className="flex items-center gap-5">
                        <div className="border-2 border-green-500/80 rounded-xl px-5 py-3 flex items-center gap-3 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-600">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiGlobe className="text-green-600 text-lg" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800">Total</div>
                                <div className="text-xs text-gray-500">Included in Total</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-800 cursor-pointer hover:text-gray-900 group">
                            <span className="text-xl font-bold">0 ₫</span>
                            <HiChevronDown className="text-lg group-hover:translate-y-0.5 transition-transform" />
                        </div>
                    </div>

                    {/* Right side - Icons and buttons */}
                    <div className="flex items-center gap-3">
                        <DateRangePicker setTransaction ={setTransaction} />
                        <button
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md group"
                            aria-label="Chat"
                        >
                            <HiOutlineChatBubbleLeftRight className="text-xl text-gray-600 group-hover:text-purple-600 transition-colors" />
                        </button>
                        <SearchModal />
                        <button style={{borderRadius: '12px'}} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                            ADD WALLET
                        </button>
                        <button style={{borderRadius: '12px'}} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                            ADD TRANSACTION
                        </button>
                        <button style={{borderRadius: '50%'}} className="w-11 h-11 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-all duration-200 font-bold text-gray-700 shadow-md hover:shadow-lg hover:scale-110 active:scale-95">
                            <SideBar avatar={avatar} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

