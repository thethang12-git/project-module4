"use client";

import {FiCreditCard, FiTrendingDown, FiTrendingUp} from "react-icons/fi";
import {Wallet} from "@/src/types/wallet";
import type {ReactNode} from "react";

type WalletListSectionProps = {
    wallets: Wallet[];
};

const WalletListSection = ({wallets}: WalletListSectionProps) => {
    const formatCurrency = (value: number, currency = "VND") =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency,
            maximumFractionDigits: 0
        }).format(Math.abs(value));

    const iconMap: Record<Wallet["type"], ReactNode> = {
        cash: <FiTrendingUp className="h-5 w-5"/>,
        card: <FiCreditCard className="h-5 w-5"/>,
        savings: <FiTrendingUp className="h-5 w-5"/>
    };

    return (
        <section className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-sm shadow-slate-200 backdrop-blur">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Danh sách ví</h2>
                    <p className="text-sm text-slate-500">Cập nhật lần cuối {wallets[0]?.lastUpdated}</p>
                </div>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Xem tất cả</button>
            </header>

            <div className="space-y-4">
                {wallets.map((wallet) => {
                    const isNegative = wallet.balance < 0;
                    const progress = wallet.limit
                        ? Math.min(Math.abs(wallet.balance) / wallet.limit, 1) * 100
                        : 0;

                    return (
                        <article
                            key={wallet.id}
                            className="flex flex-wrap gap-4 rounded-2xl border border-slate-100 bg-gradient-to-r from-white via-white to-blue-50/40 p-5 shadow-sm"
                        >
                            <div className="flex min-w-[180px] flex-1 items-start gap-4">
                                <div className="rounded-2xl bg-slate-900/90 p-3 text-white">
                                    {iconMap[wallet.type]}
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        {wallet.type === "cash" ? "Ví tiền mặt" : wallet.type === "card" ? "Thẻ" : "Tiết kiệm"}
                                    </p>
                                    <h3 className="text-base font-semibold text-slate-900">{wallet.name}</h3>
                                    <p className="text-sm text-slate-500">Cập nhật {wallet.lastUpdated}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-lg font-semibold ${isNegative ? "text-rose-600" : "text-slate-900"}`}>
                                    {isNegative ? "-" : ""}{formatCurrency(wallet.balance, wallet.currency)}
                                </p>
                                <div className="mt-1 flex items-center justify-end gap-2 text-xs font-medium">
                                    {wallet.trend === "up" ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
                                            <FiTrendingUp className="h-3 w-3"/>
                                            +{wallet.change}%
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-rose-500">
                                            <FiTrendingDown className="h-3 w-3"/>
                                            -{wallet.change}%
                                        </span>
                                    )}
                                    {wallet.limit && (
                                        <span className="text-slate-500">
                                            Hạn mức {formatCurrency(wallet.limit, wallet.currency)}
                                        </span>
                                    )}
                                </div>
                                {wallet.limit && (
                                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full ${isNegative ? "bg-rose-500" : "bg-indigo-500"}`}
                                            style={{width: `${progress}%`}}
                                        />
                                    </div>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default WalletListSection;

