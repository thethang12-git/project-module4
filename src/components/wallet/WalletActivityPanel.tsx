"use client";

import {WalletActivity} from "@/src/types/wallet";

type WalletActivityPanelProps = {
    activities: WalletActivity[];
};

const WalletActivityPanel = ({activities}: WalletActivityPanelProps) => {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0
        }).format(Math.abs(value));

    return (
        <section className="space-y-4 rounded-3xl bg-white/90 p-6 shadow-sm shadow-slate-200 backdrop-blur">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Hoạt động mới</h2>
                    <p className="text-sm text-slate-500">Theo dõi dòng tiền theo thời gian</p>
                </div>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Xem chi tiết</button>
            </header>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <article
                        key={activity.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-900">{activity.label}</p>
                            <p className="text-xs text-slate-500">{activity.category} · {activity.time}</p>
                        </div>
                        <p
                            className={`text-sm font-semibold ${activity.direction === "income" ? "text-emerald-600" : "text-rose-500"}`}
                        >
                            {activity.direction === "income" ? "+" : "-"}
                            {formatCurrency(activity.amount)}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default WalletActivityPanel;

