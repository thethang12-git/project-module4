"use client";

import {FiPlusCircle} from "react-icons/fi";
import {WalletSummary} from "@/src/types/wallet";
import AddWalletModal from "@/src/components/wallet/AddWalletModal";
import {useState} from "react";

type WalletHeroProps = {
    summary: WalletSummary;
    onAddWallet?: (a:object) => void;
};

const WalletHero = ({summary, onAddWallet}: WalletHeroProps) => {
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

    return (
        <header className="flex flex-wrap items-center justify-between gap-6">
            <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Quản lý tài chính</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Ví của tôi</h1>
                <p className="mt-2 text-slate-500 max-w-xl">
                    Theo dõi toàn bộ nguồn tiền, hạn mức và hoạt động mới nhất trong cùng một trang
                    với giao diện hiện đại, đồng nhất cùng hệ thống.
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
                    Đồng bộ lần cuối: {summary.lastSnapshot}
                </p>
            </div>
            <button
                onClick={() => setIsWalletModalOpen(true)}
                className="rounded-4 inline-flex items-center gap-2 bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
                <FiPlusCircle className="h-4 w-4"/>
                Thêm ví mới
            </button>
            <AddWalletModal
                isOpen={isWalletModalOpen}
                onClose={() => setIsWalletModalOpen(false)}
                onCreated={(wallet):void => {
                    if (onAddWallet) {
                        onAddWallet(wallet)
                    }
                }}
            />
        </header>
    );
};

export default WalletHero;

