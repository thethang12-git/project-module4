"use client";

import {FiTrendingDown, FiTrendingUp} from "react-icons/fi";
import {WalletSummary} from "@/src/types/wallet";

type WalletSummaryCardsProps = {
    summary: WalletSummary;
    positiveRatio?: number;
};

const WalletSummaryCards = ({summary}: WalletSummaryCardsProps) => {
    const positiveRatio = summary.totalWallets
        ? (summary.positiveWallets / summary.totalWallets) * 100
        : 0;
    const isGrowthPositive = summary.growthRate >= 0;
    const growthBadgeClasses = isGrowthPositive
        ? "bg-emerald-50 text-emerald-700"
        : "bg-rose-50 text-rose-600";
    const growthIcon = isGrowthPositive ? <FiTrendingUp className="h-4 w-4"/> : <FiTrendingDown className="h-4 w-4"/>;
    const growthText = `${Math.abs(summary.growthRate).toFixed(1)}% so với tháng trước`;

    return (
        <section className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-5 shadow-sm shadow-slate-200 backdrop-blur">
                <p className="text-sm text-slate-500">Tổng số dư</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0
                    }).format(summary.totalBalance)}
                </p>
                <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${growthBadgeClasses}`}>
                    {growthIcon}
                    {growthText}
                </div>
            </div>
            <div className="rounded-2xl bg-white/80 p-5 shadow-sm shadow-slate-200 backdrop-blur">
                <p className="text-sm text-slate-500">Ví khả dụng</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {summary.positiveWallets}
                </p>
                <p className="mt-1 text-sm text-slate-500">Đang có số dư dương</p>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{width: `${positiveRatio}%`}}
                    />
                </div>
            </div>
            <div className="rounded-2xl bg-white/80 p-5 shadow-sm shadow-slate-200 backdrop-blur">
                <p className="text-sm text-slate-500">Ví cần chú ý</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {summary.negativeWallets}
                </p>
                <p className="mt-1 text-sm text-slate-500">Đang vượt hạn mức</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                    <FiTrendingDown className="h-4 w-4"/>
                    Kiểm tra ngay để tránh phí phạt
                </div>
            </div>
        </section>
    );
};

export default WalletSummaryCards;

