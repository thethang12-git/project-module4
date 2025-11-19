"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import WalletHero from "@/src/components/wallet/WalletHero";
import WalletSummaryCards from "@/src/components/wallet/WalletSummaryCards";
import WalletListSection from "@/src/components/wallet/WalletListSection";
import WalletActivityPanel from "@/src/components/wallet/WalletActivityPanel";
import WalletQuickActions from "@/src/components/wallet/WalletQuickActions";
import WalletService from "@/src/service/walletService";
import {WalletDashboardData} from "@/src/types/wallet";
import SideBar from "@/src/components/sidebar";

export default function Wallets() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<WalletDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedAvatar = localStorage.getItem("avatar");
        if (storedUserId) {
            try {
                setUserId(JSON.parse(storedUserId));
            } catch (err) {
                setUserId(storedUserId);
            }
        } else {
            setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            setIsLoading(false);
        }
        if (storedAvatar) {
            try {
                setAvatar(JSON.parse(storedAvatar));
            } catch (err) {
                setAvatar(storedAvatar);
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
        let isMounted = true;
        setIsLoading(true);
        setError(null);
        WalletService.fetchDashboard(userId)
            .then((data) => {
                if (!isMounted) return;
                setDashboard(data);
            })
            .catch(() => {
                if (!isMounted) return;
                setError("Không thể tải dữ liệu từ máy chủ JSON. Hãy đảm bảo đã chạy db.json bằng json-server.");
            })
            .finally(() => {
                if (!isMounted) return;
                setIsLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm font-medium text-slate-500">Đang tải dữ liệu ví...</p>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
                <div className="max-w-md space-y-4">
                    <p className="text-base font-semibold text-rose-600">Không thể hiển thị Ví của tôi</p>
                    <p className="text-sm text-slate-500">{error ?? "Không có dữ liệu ví khả dụng."}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => router.push("/home")}
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white"
                        >
                            Về trang tổng quan
                        </button>
                        <button
                            onClick={() => location.reload()}
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-20 w-[26rem] h-[26rem] bg-blue-200/25 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-16 w-[28rem] h-[28rem] bg-purple-200/25 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto max-w-6xl px-6 py-10 space-y-10">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/80 px-5 py-3 shadow-sm shadow-slate-200 backdrop-blur">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    >
                        <span aria-hidden="true">←</span>
                        Quay lại
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push("/home")}
                            className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                        >
                            Về trang chủ
                        </button>
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 p-0.5 shadow-inner">
                            <SideBar avatar={avatar}/>
                        </div>
                    </div>
                </div>

                <WalletHero summary={dashboard.summary}/>
                <WalletSummaryCards summary={dashboard.summary}/>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <WalletListSection wallets={dashboard.wallets}/>
                    </div>
                    <WalletActivityPanel activities={dashboard.activities}/>
                </div>

                <WalletQuickActions actions={dashboard.quickActions}/>
            </div>
        </div>
    );
}