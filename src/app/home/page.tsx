"use client"

import HeaderHome from "@/src/components/home/HeaderHome"
import SummaryCard from "@/src/components/home/SummaryCard"
import DateCard from "@/src/components/home/DateCard"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <HeaderHome />

            {/* Main Content */}
            <div className="relative container mx-auto px-6 py-10 max-w-6xl">
                <div className="space-y-8">
                    {/* Summary Card */}
                    <SummaryCard />

                    {/* Date Card */}
                    <DateCard />
                </div>
            </div>
        </div>
    )
}

