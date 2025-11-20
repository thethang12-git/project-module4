"use client"

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react"
import { createPortal } from "react-dom"

import UserService from "@/src/service/dataService"

interface EditWalletModalProps {
    wallet: any | null
    isOpen: boolean
    onClose: () => void
    onUpdated?: (wallet: any) => void
}

interface FormState {
    name: string
    description: string
}

export default function EditWalletModal({ wallet, isOpen, onClose, onUpdated }: EditWalletModalProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [form, setForm] = useState<FormState>({ name: "", description: "" })
    const [error, setError] = useState("")
    const [serverError, setServerError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true)
            requestAnimationFrame(() => setIsVisible(true))
        } else {
            setIsVisible(false)
            const timeout = setTimeout(() => setIsMounted(false), 200)
            return () => clearTimeout(timeout)
        }
    }, [isOpen])

    useEffect(() => {
        if (wallet && isOpen) {
            setForm({
                name: wallet.name ?? "",
                description: wallet.description ?? "",
            })
            setError("")
            setServerError("")
        }
    }, [wallet, isOpen])

    const handleClose = () => {
        if (isSubmitting) return
        setIsVisible(false)
        setTimeout(() => onClose(), 180)
    }

    const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
    }

    const validate = () => {
        if (!form.name.trim()) {
            setError("Tên ví là bắt buộc")
            return false
        }
        setError("")
        return true
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!wallet?.id || !validate()) return
        try {
            setIsSubmitting(true)
            setServerError("")
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
            }
            const response = await UserService.updateWallet(wallet.id, payload)
            onUpdated?.(response.data)
            handleClose()
        } catch (err) {
            setServerError("Không thể cập nhật ví. Vui lòng thử lại sau.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isMounted || !wallet) return null

    const nameInputId = `edit-wallet-name-${wallet?.id ?? "new"}`
    const descriptionInputId = `edit-wallet-description-${wallet?.id ?? "new"}`

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
                className={`relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 ${
                    isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Chỉnh sửa ví</h2>
                    <p className="mt-1 text-sm text-gray-500">Cập nhật tên và mô tả ví của bạn.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor={nameInputId} className="text-sm font-medium text-gray-700">
                            Tên ví <span className="text-red-500">*</span>
                        </label>
                        <input
                            id={nameInputId}
                            type="text"
                            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            value={form.name}
                            onChange={handleChange("name")}
                            disabled={isSubmitting}
                        />
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                    <div>
                        <label htmlFor={descriptionInputId} className="text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea
                            id={descriptionInputId}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            rows={3}
                            value={form.description}
                            onChange={handleChange("description")}
                            disabled={isSubmitting}
                        />
                    </div>
                    {serverError && (
                        <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Hủy
                    </button>
                    <button style={{borderRadius: '12px'}}
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>,
        document.body,
    )
}

