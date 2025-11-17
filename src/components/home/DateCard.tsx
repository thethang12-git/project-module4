"use client"

export default function DateCard() {
    return (
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl shadow-lg border border-gray-200/50 p-8 flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
                    <div className="relative text-4xl font-extrabold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        14
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-800 font-bold text-lg">Friday</span>
                    <span className="text-gray-500 text-sm font-medium">November 2025</span>
                </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50">
                <span className="text-blue-600 font-bold text-lg">+0 ₫</span>
            </div>
        </div>
    )
}

