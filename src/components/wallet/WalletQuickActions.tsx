"use client";

import {FiArrowRight} from "react-icons/fi";
import {WalletQuickAction} from "@/src/types/wallet";

type WalletQuickActionsProps = {
    actions: WalletQuickAction[];
};

const WalletQuickActions = ({actions}: WalletQuickActionsProps) => {
    return (
        <section className="rounded-3xl bg-white/95 p-6 shadow-sm shadow-slate-200 backdrop-blur">
            <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Hành động nhanh</h2>
                    <p className="text-sm text-slate-500">Tối ưu quản lý tiền chỉ trong vài chạm</p>
                </div>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Quản lý hành động</button>
            </header>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {actions.map((action) => (
                    <div
                        key={action.label}
                        className={`group flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br ${action.color} p-4 text-white shadow-md transition hover:-translate-y-1`}
                    >
                        <div>
                            <p className="text-sm uppercase tracking-wide text-white/70">Tác vụ</p>
                            <h3 className="mt-1 text-lg font-semibold">{action.label}</h3>
                            <p className="mt-1 text-sm text-white/80">{action.description}</p>
                        </div>
                        <FiArrowRight className="mt-4 h-5 w-5 opacity-75 transition group-hover:translate-x-1"/>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WalletQuickActions;

