"use client"
import { FiGlobe } from "react-icons/fi"
import { HiOutlineChatBubbleLeftRight, HiCheckCircle, HiOutlinePencilSquare, HiOutlinePlusCircle, HiOutlineTrash } from "react-icons/hi2"
import { HiChevronDown } from "react-icons/hi"
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from '@/src/store/hooks';
import  { setUser} from "@/src/store/slices/user";
import UserDropdown from "./UserDropdown"
import SearchModal from "@/src/components/search";
import DateRangePicker from "@/src/components/dateRangePicker";
import AddWalletModal from "@/src/components/wallet/AddWalletModal";
import EditWalletModal from "@/src/components/wallet/EditWalletModal";
import AddMoneyModal from "@/src/components/wallet/AddMoneyModal";
import {setTransactions} from "@/src/store/slices/transactions";
import AddTransactionModal from "@/src/components/home/AddTransactionModal";
import UserService from "@/src/service/dataService";

export default function HeaderHome({
    setTransaction,
    transactions,
    total,
    wallets = [],
    recentWallet,
    onWalletCreated,
    onWalletUpdated,
    onTransactionCreated,
    onWalletDeleted,
    }: any) {
    const formatCurrency = useMemo(
        () => new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0
        }),
        []
    );

    // Calculate total balance from all wallets
    const totalBalance = useMemo(() => {
        return wallets.reduce((sum, wallet) => {
            return sum + (parseFloat(wallet.current_balance) || 0);
        }, 0);
    }, [wallets]);

    const formattedTotal = formatCurrency.format(totalBalance);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [isWalletInfoOpen, setIsWalletInfoOpen] = useState(false);
    const [highlightWalletId, setHighlightWalletId] = useState<string | number | null>(null);
    const [selectedWalletId, setSelectedWalletId] = useState<string | number | null>(null);
    const walletInfoRef = useRef<HTMLDivElement | null>(null);
    const [editingWallet, setEditingWallet] = useState<any | null>(null);
    const dispatch = useAppDispatch();
    const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
    const [walletForDeposit, setWalletForDeposit] = useState<any | null>(null);
    const [deletingWalletId, setDeletingWalletId] = useState<string | number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
    useEffect(() => {
        const user = localStorage.getItem("user");
        const email = localStorage.getItem("email");
        const avatar = localStorage.getItem("avatar");
        if(user && email)  {
            const parsedUser = JSON.parse(user);
            const parsedEmail = JSON.parse(email);
            dispatch(setUser(parsedUser));
            setUsername(parsedUser);
            setEmail(parsedEmail);
            if (avatar) {
                setAvatar(JSON.parse(avatar));
            }
        }
    }, [dispatch]);

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
        setDeleteError(null);
    };

    const handleDeleteWallet = async (wallet: any) => {
        if (!wallet?.id) return;
        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa ví "${wallet.name}" và toàn bộ lịch sử giao dịch của ví này?`);
        if (!confirmed) return;

        try {
            setDeletingWalletId(wallet.id);
            setDeleteError(null);
            await UserService.deleteWalletAndTransactions(wallet.id);
            if (selectedWalletId === wallet.id) {
                setSelectedWalletId(null);
            }
            onWalletDeleted?.(wallet.id);
            onTransactionCreated?.();
        } catch (err) {
            setDeleteError("Không thể xóa ví. Vui lòng thử lại.");
        } finally {
            setDeletingWalletId(null);
        }
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
                                    <div className="max-h-64 space-y-3 overflow-y-auto">
                                        <div
                                            className={`rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
                                                selectedWalletId === null 
                                                    ? "border-green-400 bg-linear-to-br from-green-50 to-white shadow-md" 
                                                    : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
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
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-green-100 to-green-50 text-green-600 shadow-sm">
                                                        <FiGlobe className="text-base" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">Total</p>
                                                        <p className="text-xs text-gray-500">Tổng tất cả ví</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-0.5">
                                                        Số dư
                                                    </p>
                                                    <p className="text-base font-bold text-gray-900">{formattedTotal}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-1">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                                Included in Total
                                            </p>
                                        </div>
                                        {wallets.length ? (
                                            wallets.map(wallet => (
                                                <div
                                                    key={wallet.id}
                                                    className={`group relative rounded-xl border transition-all duration-200 ${
                                                        highlightWalletId === wallet.id
                                                            ? "border-green-400 bg-linear-to-br from-green-50 to-white shadow-md"
                                                            : selectedWalletId === wallet.id
                                                                ? "border-green-300 bg-linear-to-br from-green-50/80 to-white shadow-sm"
                                                                : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                                                    }`}
                                                >
                                                    <div className="p-3">
                                                        <div className="flex items-start justify-between gap-3">
                                                            {/* Left: Wallet Info */}
                                                            <button
                                                                type="button"
                                                                className="flex-1 text-left transition-opacity hover:opacity-80"
                                                                onClick={() => {
                                                                    setSelectedWalletId(wallet.id);
                                                                    setIsWalletInfoOpen(false);
                                                                }}
                                                            >
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-sm font-semibold text-gray-900">{wallet.name}</p>
                                                                        {selectedWalletId === wallet.id && (
                                                                            <HiCheckCircle className="text-green-500 text-base shrink-0" />
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 line-clamp-1">
                                                                        {wallet.description || "Không có mô tả"}
                                                                    </p>
                                                                </div>
                                                            </button>

                                                            {/* Right: Balance */}
                                                            <div className="shrink-0 text-right">
                                                                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 mb-0.5">
                                                                    Số dư
                                                                </p>
                                                                <p className="text-base font-bold text-gray-900">
                                                                    {formatCurrency.format(wallet.current_balance ?? 0)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                                                            <button
                                                                type="button"
                                                                title="Thêm tiền"
                                                                onClick={event => {
                                                                    event.stopPropagation();
                                                                    setWalletForDeposit(wallet);
                                                                    setIsAddMoneyModalOpen(true);
                                                                }}
                                                                aria-label={`Thêm tiền vào ví ${wallet.name}`}
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-600 active:scale-[0.96]"
                                                            >
                                                                <HiOutlinePlusCircle className="text-base" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                title="Chỉnh sửa"
                                                                aria-label={`Chỉnh sửa ví ${wallet.name}`}
                                                                onClick={() => {
                                                                    setEditingWallet(wallet);
                                                                }}
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.96]"
                                                            >
                                                                <HiOutlinePencilSquare className="text-base" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                title="Xóa ví"
                                                                aria-label={`Xóa ví ${wallet.name}`}
                                                                disabled={deletingWalletId === wallet.id}
                                                                onClick={event => {
                                                                    event.stopPropagation();
                                                                    handleDeleteWallet(wallet);
                                                                }}
                                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-500"
                                                            >
                                                                {deletingWalletId === wallet.id ? (
                                                                    <span className="text-[10px] font-semibold">...</span>
                                                                ) : (
                                                                    <HiOutlineTrash className="text-base" />
                                                                )}
                                                            </button>
                                                        </div>
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
                                    {deleteError && (
                                        <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                                            {deleteError}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side - Icons and buttons */}
                    <div className="flex items-center gap-3">
                        <DateRangePicker setTransaction ={setTransaction} />
                        <button
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md group"
                            aria-label="Chat"
                        >
                            <HiOutlineChatBubbleLeftRight className="text-xl text-gray-600 group-hover:text-purple-600 transition-colors" />
                        </button>
                        <SearchModal setTransaction={setTransaction} />
                        <button style={{borderRadius: '12px'}}
                            onClick={() => setIsWalletModalOpen(true)}
                            className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                            ADD WALLET
                        </button>
                        <button
                            style={{borderRadius: '12px'}}
                            onClick={() => setIsAddTransactionModalOpen(true)}
                            className="px-5 py-2.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
                            ADD TRANSACTION
                        </button>
                        <div className="relative">
                            <button
                                style={{ borderRadius: '50%' }}
                                aria-label="Open user menu"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="w-11 h-11 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition-all duration-200 font-bold text-white shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
                            >
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt={username}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-lg">
                                        {username ? username.charAt(0).toUpperCase() : "N"}
                                    </span>
                                )}
                            </button>
                            <UserDropdown
                                isOpen={isUserDropdownOpen}
                                onClose={() => setIsUserDropdownOpen(false)}
                                avatar={avatar}
                                username={username}
                                email={email}
                            />
                        </div>
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
                <AddTransactionModal
                    isOpen={isAddTransactionModalOpen}
                    onClose={() => setIsAddTransactionModalOpen(false)}
                    wallets={wallets}
                    onTransactionCreated={() => {
                        onTransactionCreated?.();
                        setIsAddTransactionModalOpen(false);
                    }}
                    onWalletUpdated={handleWalletEdited}
                />
            </div>
        </>
    )
}

