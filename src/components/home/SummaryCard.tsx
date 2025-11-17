"use client"

import { useState } from "react"

type TabType = "LAST MONTH" | "THIS MONTH" | "FUTURE"

export default function SummaryCard() {
    const [activeTab, setActiveTab] = useState<TabType>("THIS MONTH")

    const tabs: TabType[] = ["LAST MONTH", "THIS MONTH", "FUTURE"]

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200/50 mb-8 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-4 font-semibold text-sm transition-all duration-200 relative ${
                            activeTab === tab
                                ? "text-green-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Financial figures */}
            <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 hover:from-blue-50 hover:to-cyan-50 transition-all duration-200 border border-blue-100/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700 font-semibold">Inflow</span>
                    </div>
                    <span className="text-blue-600 font-bold text-base">+0 ₫</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-red-50/50 to-pink-50/50 hover:from-red-50 hover:to-pink-50 transition-all duration-200 border border-red-100/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-gray-700 font-semibold">Outflow</span>
                    </div>
                    <span className="text-red-600 font-bold text-base">-0 ₫</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200/50 mt-4">
                    <span className="text-gray-800 font-bold text-lg">NET</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold text-lg">
                        +0 ₫
                    </span>
                </div>
            </div>

            {/* View report link */}
            <div className="flex justify-center">
                <a
                    href="#"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm transition-all duration-200 hover:gap-3 group"
                >
                    <span>VIEW REPORT FOR THIS PERIOD</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>
        </div>
    )
}

