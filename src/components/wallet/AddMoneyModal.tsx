"use client"
import { FormEvent, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import UserService from "@/src/service/dataService"

interface AddMoneyModalProps {
    wallet: any | null
    isOpen: boolean
    onClose: () => void
    onDeposited?: (wallet: any) => void
}

export default function AddMoneyModal({ wallet, isOpen, onClose, onDeposited }: AddMoneyModalProps) {
    const [amount, setAmount] = useState<string>("")
    const [note, setNote] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setAmount("")
            setNote("")
            setError("")
        }
    }, [isOpen, wallet])

    const amountNumber = useMemo(() => {
        const value = parseFloat(amount.replace(/,/g, ""))
        return Number.isNaN(value) ? 0 : value
    }, [amount])

    if (!mounted || !isOpen || typeof document === "undefined") {
        return null
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (!wallet) return

        if (amountNumber <= 0) {
            setError("Vui lòng nhập số tiền hợp lệ")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            const updatedBalance = (wallet.current_balance ?? 0) + amountNumber
            const [walletRes] = await Promise.all([
                UserService.updateWallet(wallet.id, { current_balance: updatedBalance }),
                UserService.createTransaction({
                    userId: wallet.userId,
                    walletId: wallet.id,
                    money: amountNumber,
                    name: "Nạp tiền vào ví",
                    note: note.trim(),
                    currency: "₫",
                }),
            ])

            onDeposited?.({
                ...wallet,
                current_balance: walletRes.data?.current_balance ?? updatedBalance,
            })
            onClose()
        } catch (err) {
            console.error(err)
            setError("Không thể thêm tiền. Vui lòng thử lại.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Thêm tiền vào ví</h3>
                    <p className="text-sm text-gray-500">Ví: {wallet?.name}</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="add-money-amount" className="mb-1 block text-sm font-medium text-gray-700">
                            Số tiền <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="add-money-amount"
                            type="number"
                            min="0"
                            step="1000"
                            value={amount}
                            onChange={event => setAmount(event.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            placeholder="Nhập số tiền"
                        />
                    </div>
                    <div>
                        <label htmlFor="add-money-note" className="mb-1 block text-sm font-medium text-gray-700">
                            Ghi chú
                        </label>
                        <textarea
                            id="add-money-note"
                            rows={3}
                            value={note}
                            onChange={event => setNote(event.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            placeholder="Nhập ghi chú (không bắt buộc)"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button style={{borderRadius: '12px'}}
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button style={{borderRadius: '12px'}}
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 disabled:opacity-60"
                        >
                            {isSubmitting ? "Đang lưu..." : "Thêm tiền"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

