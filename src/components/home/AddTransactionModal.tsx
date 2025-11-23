"use client"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import UserService from "@/src/service/dataService"
import { HiX } from "react-icons/hi"

interface AddTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    wallets: any[]
    onTransactionCreated?: () => void
    onWalletUpdated?: (wallet: any) => void
}

export default function AddTransactionModal({
    isOpen,
    onClose,
    wallets,
    onTransactionCreated,
    onWalletUpdated,
}: AddTransactionModalProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [form, setForm] = useState({
        walletId: "",
        categoryId: "",
        amount: "0",
        date: "",
        note: "",
    })
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true)
            requestAnimationFrame(() => setIsVisible(true))
            const userId = localStorage.getItem("userId")
            if (userId) {
                const trueId = JSON.parse(userId)
                UserService.getCategories(trueId)
                    .then(res => setCategories(res.data ?? []))
                    .catch(err => console.log(err))
            }
            // Set default date to today
            const today = new Date()
            const day = String(today.getDate()).padStart(2, "0")
            const month = String(today.getMonth() + 1).padStart(2, "0")
            const year = today.getFullYear()
            setForm(prev => ({
                ...prev,
                date: `${day}/${month}/${year}`,
                walletId: wallets.length > 0 ? wallets[0].id : "",
            }))
        } else {
            setIsVisible(false)
            const timeout = setTimeout(() => setIsMounted(false), 200)
            return () => clearTimeout(timeout)
        }
    }, [isOpen, wallets])

    useEffect(() => {
        if (isOpen) {
            setForm({
                walletId: wallets.length > 0 ? wallets[0].id : "",
                categoryId: categories.length > 0 ? categories[0].id : "",
                amount: "0",
                date: (() => {
                    const today = new Date()
                    const day = String(today.getDate()).padStart(2, "0")
                    const month = String(today.getMonth() + 1).padStart(2, "0")
                    const year = today.getFullYear()
                    return `${day}/${month}/${year}`
                })(),
                note: "",
            })
            setError("")
        }
    }, [isOpen])

    const handleClose = () => {
        if (isSubmitting) return
        setIsVisible(false)
        setTimeout(() => onClose(), 180)
    }

    const handleChange = (field: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
    }

    const formatDateForAPI = (dateStr: string): string => {
        // Convert from DD/MM/YYYY to YYYY-MM-DD
        const parts = dateStr.split("/")
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`
        }
        return dateStr
    }

    const validate = () => {
        if (!form.walletId) {
            setError("Vui lòng chọn ví")
            return false
        }
        if (!form.categoryId) {
            setError("Vui lòng chọn danh mục")
            return false
        }
        const amount = parseFloat(form.amount.replace(/,/g, ""))
        if (isNaN(amount) || amount <= 0) {
            setError("Vui lòng nhập số tiền hợp lệ")
            return false
        }
        if (!form.date) {
            setError("Vui lòng chọn ngày")
            return false
        }
        setError("")
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        const userId = localStorage.getItem("userId")
        if (!userId) {
            setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.")
            return
        }

        try {
            setIsSubmitting(true)
            setError("")

            const amount = parseFloat(form.amount.replace(/,/g, ""))
            const selectedWallet = wallets.find(w => w.id === form.walletId)
            if (!selectedWallet) {
                setError("Không tìm thấy ví được chọn")
                return
            }

            // Check if wallet has enough balance
            if (selectedWallet.current_balance < amount) {
                setError("Số dư ví không đủ")
                return
            }

            const selectedCategory = categories.find(c => c.id === form.categoryId)
            const formattedDate = formatDateForAPI(form.date)

            // Create transaction with negative money (expense)
            const transactionPayload = {
                userId: JSON.parse(userId),
                walletId: form.walletId,
                categoryId: form.categoryId,
                money: -amount, // Negative for expense
                name: selectedCategory?.name || "Transaction",
                date: formattedDate,
                note: form.note.trim(),
                currency: "₫",
            }

            // Update wallet balance (subtract amount)
            const updatedBalance = selectedWallet.current_balance - amount

            const [transactionRes, walletRes] = await Promise.all([
                UserService.createTransaction(transactionPayload),
                UserService.updateWallet(form.walletId, { current_balance: updatedBalance }),
            ])

            onWalletUpdated?.({
                ...selectedWallet,
                current_balance: walletRes.data?.current_balance ?? updatedBalance,
            })
            onTransactionCreated?.()
            handleClose()
        } catch (err: any) {
            console.error(err)
            setError(err?.response?.data?.message || "Không thể tạo giao dịch. Vui lòng thử lại.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isMounted) return null

    const selectedWallet = wallets.find(w => w.id === form.walletId)

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />
            <form
                onSubmit={handleSubmit}
                className={`relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">Add transaction</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Close modal"
                        title="Close"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed"
                    >
                        <HiX className="text-lg" />
                    </button>
                </div>

                {/* Form Content - Two Columns */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* WALLET */}
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                                WALLET
                            </label>
                            <select
                                value={form.walletId}
                                onChange={handleChange("walletId")}
                                disabled={isSubmitting}
                                title="Select wallet"
                                aria-label="Select wallet"
                                className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                                    form.walletId && selectedWallet
                                        ? "border-green-500 focus:ring-green-100"
                                        : "border-gray-200 focus:border-green-500 focus:ring-green-100"
                                }`}
                            >
                                {wallets.map(wallet => (
                                    <option key={wallet.id} value={wallet.id}>
                                        {wallet.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* AMOUNT */}
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                                AMOUNT
                            </label>
                            <input
                                type="text"
                                value={form.amount}
                                onChange={e => {
                                    const value = e.target.value.replace(/[^0-9]/g, "")
                                    setForm(prev => ({ ...prev, amount: value }))
                                }}
                                disabled={isSubmitting}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                placeholder="0"
                            />
                        </div>

                        {/* NOTE */}
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                                NOTE
                            </label>
                            <textarea
                                value={form.note}
                                onChange={handleChange("note")}
                                disabled={isSubmitting}
                                rows={4}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                placeholder="Thêm ghi chú để bạn dễ nhớ hơn"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* CATEGORY */}
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                                CATEGORY
                            </label>
                            <select
                                value={form.categoryId}
                                onChange={handleChange("categoryId")}
                                disabled={isSubmitting}
                                title="Select category"
                                aria-label="Select category"
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DATE */}
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                                DATE
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={form.date}
                                    onChange={e => {
                                        let value = e.target.value.replace(/[^0-9/]/g, "")
                                        // Auto format DD/MM/YYYY
                                        if (value.length <= 2) {
                                            // DD
                                        } else if (value.length <= 5) {
                                            // DD/MM
                                            if (value.length === 3 && !value.includes("/")) {
                                                value = value.slice(0, 2) + "/" + value.slice(2)
                                            }
                                        } else {
                                            // DD/MM/YYYY
                                            if (value.length === 6 && value.split("/").length === 2) {
                                                value = value.slice(0, 5) + "/" + value.slice(5)
                                            }
                                            if (value.length > 10) {
                                                value = value.slice(0, 10)
                                            }
                                        }
                                        setForm(prev => ({ ...prev, date: value }))
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="DD/MM/YYYY"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                                />
                                <svg
                                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add more details link */}
                <div className="mt-4">
                    <button
                        type="button"
                        className="text-sm text-green-600 underline hover:text-green-700"
                        title="Add more details"
                        aria-label="Add more details"
                    >
                        Add more details
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed"
                        style={{ borderRadius: "12px" }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ borderRadius: "12px" }}
                    >
                        {isSubmitting ? "Đang lưu..." : "SAVE"}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    )
}

