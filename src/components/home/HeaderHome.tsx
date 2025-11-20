"use client"
import { FiGlobe } from "react-icons/fi"
import { HiOutlineChatBubbleLeftRight, HiCheckCircle, HiOutlinePencilSquare, HiOutlinePlusCircle } from "react-icons/hi2"
import { HiChevronDown } from "react-icons/hi"
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from '@/src/store/hooks';
import  { setUser} from "@/src/store/slices/user";
import SideBar from "../sidebar"
import SearchModal from "@/src/components/search";
import DateRangePicker from "@/src/components/dateRangePicker";
import AddWalletModal from "@/src/components/wallet/AddWalletModal";
import EditWalletModal from "@/src/components/wallet/EditWalletModal";
import AddMoneyModal from "@/src/components/wallet/AddMoneyModal";

export default function HeaderHome({
    setTransaction,
    transactions,
    total,
    wallets = [],
    recentWallet,
    onWalletCreated,
    onWalletUpdated,
    onTransactionCreated,
    }: any) {
    const formatCurrency = useMemo(
        () => new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0
        }),
        []
    );
    const formattedTotal = formatCurrency.format(total ?? 0);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isWalletInfoOpen, setIsWalletInfoOpen] = useState(false);
    const [highlightWalletId, setHighlightWalletId] = useState<string | number | null>(null);
    const [selectedWalletId, setSelectedWalletId] = useState<string | number | null>(null);
    const walletInfoRef = useRef<HTMLDivElement | null>(null);
    const [editingWallet, setEditingWallet] = useState<any | null>(null);
    const dispatch = useAppDispatch();
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
    const [walletForDeposit, setWalletForDeposit] = useState<any | null>(null);
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

    useEffect(() => {
        if (recentWallet?.id) {
            setHighlightWalletId(recentWallet.id);
            setIsWalletInfoOpen(true);
            const timer = setTimeout(() => setHighlightWalletId(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [recentWallet]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (walletInfoRef.current && !walletInfoRef.current.contains(event.target as Node)) {
                setIsWalletInfoOpen(false);
            }
        };

        if (isWalletInfoOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isWalletInfoOpen]);

    useEffect(() => {
        if (selectedWalletId && !wallets.some(wallet => wallet.id === selectedWalletId)) {
            setSelectedWalletId(null);
        }
    }, [wallets, selectedWalletId]);

    const selectedWallet = selectedWalletId ? wallets.find(wallet => wallet.id === selectedWalletId) : null;
    const displayTitle = selectedWallet ? selectedWallet.name : "Total";
    const displaySubtitle = selectedWallet ? (selectedWallet.description || "Số dư hiện tại") : "Included in Total";
    const displayAmount = selectedWallet ? formatCurrency.format(selectedWallet.current_balance ?? 0) : formattedTotal;

    const handleWalletEdited = (wallet: any) => {
        if (!wallet) return;
        onWalletUpdated?.(wallet);
        setHighlightWalletId(wallet.id);
        setEditingWallet(null);
    };

    return (
        <>
            <div className="w-full bg-linear-to-r from-white via-gray-50 to-white border-b border-gray-200/50 shadow-sm backdrop-blur-sm px-6 py-5 sticky top-0 z-50">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    {/* Left side - Total box */}
                    <div className="flex items-center gap-5">
                        <div
                            ref={walletInfoRef}
                            className="relative flex items-center gap-3 rounded-2xl border border-green-500/70 bg-linear-to-r from-green-50 via-white to-green-50 px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => setIsWalletInfoOpen(prev => !prev)}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                                <FiGlobe className="text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">{displayTitle}</span>
                                <span className="text-xs text-gray-500">{displaySubtitle}</span>
                            </div>
                            <div className="ml-6 flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">{displayAmount}</span>
                                <HiChevronDown className="text-base text-gray-500" />
                            </div>
                            {isWalletInfoOpen && (
                                <div className="absolute left-0 top-full mt-3 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl p-4 z-20">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Ví của tôi</p>
                                            <p className="text-xs text-gray-500">Nhấn vào ví để xem chi tiết</p>
                                        </div>
                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            {wallets.length} ví
                                        </span>
                                    </div>
                                    <div className="max-h-64 space-y-2 overflow-y-auto">
                                        <div
                                            className={`flex items-center justify-between rounded-xl border px-3 py-2 transition cursor-pointer ${
                                                selectedWalletId === null ? "border-green-400 bg-green-50" : "border-gray-100 bg-gray-50 hover:border-green-200"
                                            }`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setSelectedWalletId(null);
                                                setIsWalletInfoOpen(false);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    setSelectedWalletId(null);
                                                    setIsWalletInfoOpen(false);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                                                    <FiGlobe />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">Total</p>
                                                    <p className="text-xs text-gray-500">Tổng tất cả ví</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Số dư</p>
                                                <p className="text-sm font-semibold text-gray-900">{formattedTotal}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-400 px-1 pt-1">Included in Total</p>
                                        {wallets.length ? (
                                            wallets.map(wallet => (
                                                <div
                                                    key={wallet.id}
                                                    className={`rounded-xl border px-3 py-2 transition ${
                                                        highlightWalletId === wallet.id
                                                            ? "border-green-400 bg-green-50"
                                                            : selectedWalletId === wallet.id
                                                                ? "border-green-200 bg-green-50/70"
                                                                : "border-gray-100 bg-gray-50 hover:border-green-200"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className="flex flex-1 items-center justify-between gap-3 text-left"
                                                            onClick={() => {
                                                                setSelectedWalletId(wallet.id);
                                                                setIsWalletInfoOpen(false);
                                                            }}
                                                        >
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-900">{wallet.name}</p>
                                                                <p className="text-xs text-gray-500">{wallet.description || "Không có mô tả"}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-right">
                                                                    <p className="text-xs text-gray-400">Số dư</p>
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        {(wallet.current_balance ?? 0).toLocaleString("vi-VN")} ₫
                                                                    </p>
                                                                </div>
                                                                {selectedWalletId === wallet.id && (
                                                                    <HiCheckCircle className="text-green-500 text-lg" />
                                                                )}
                                                            </div>

                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                                setWalletForDeposit(wallet);
                                                                setIsAddMoneyModalOpen(true);
                                                            }}
                                                            aria-label={`Thêm tiền vào ví ${wallet.name}`}
                                                            className="rounded-full border border-gray-200 p-1 text-gray-500 hover:border-green-300 hover:text-green-600"
                                                        >
                                                            <HiOutlinePlusCircle className="text-lg" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            aria-label={`Chỉnh sửa ví ${wallet.name}`}
                                                            onClick={() => {
                                                                setEditingWallet(wallet);
                                                            }}
                                                            className="rounded-full border border-gray-200 p-1 text-gray-500 hover:border-green-300 hover:text-green-600"
                                                        >
                                                            <HiOutlinePencilSquare className="text-lg" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center">
                                                <p className="text-sm text-gray-500">
                                                    Chưa có ví nào. Nhấn “ADD WALLET” để thêm ví đầu tiên.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side - Icons and buttons */}
                    <div className="flex items-center gap-3">
                        <DateRangePicker transactions ={ transactions} setTransaction ={setTransaction} />
                        <button
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md group"
                            aria-label="Chat"
                        >
                            <HiOutlineChatBubbleLeftRight className="text-xl text-gray-600 group-hover:text-purple-600 transition-colors" />
                        </button>
                        <SearchModal />
                        <button style={{borderRadius: '12px'}}
                            onClick={() => setIsWalletModalOpen(true)}
                            className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                            ADD WALLET
                        </button>
                        <button style={{borderRadius: '12px'}} className="px-5 py-2.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                            ADD TRANSACTION
                        </button>
                        <button style={{borderRadius: '50%'}}
                            aria-label="Open sidebar"
                            className="w-11 h-11 bg-linear-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-all duration-200 font-bold text-gray-700 shadow-md hover:shadow-lg hover:scale-110 active:scale-95">
                            <SideBar avatar={avatar} />
                        </button>
                    </div>
                </div>
                <AddWalletModal
                    isOpen={isWalletModalOpen}
                    onClose={() => setIsWalletModalOpen(false)}
                    onCreated={(wallet) => {
                        onWalletCreated?.(wallet);
                    }}
                />
                <EditWalletModal
                    wallet={editingWallet}
                    isOpen={Boolean(editingWallet)}
                    onClose={() => setEditingWallet(null)}
                    onUpdated={handleWalletEdited}
                />
                <AddMoneyModal
                    wallet={walletForDeposit}
                    isOpen={isAddMoneyModalOpen && Boolean(walletForDeposit)}
                    onClose={() => {
                        setIsAddMoneyModalOpen(false);
                        setWalletForDeposit(null);
                    }}
                    onDeposited={updatedWallet => {
                        handleWalletEdited(updatedWallet);
                        onTransactionCreated?.();
                        setIsAddMoneyModalOpen(false);
                        setWalletForDeposit(null);
                    }}
                />
            </div>
        </>
    )
}

