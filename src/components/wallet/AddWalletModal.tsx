import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import UserService from "@/src/service/dataService";

interface AddWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated?: (wallet: any) => void;
}

const initialFormState = {
    name: "",
    description: ""
};

export default function AddWalletModal({ isOpen, onClose, onCreated }: AddWalletModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [form, setForm] = useState(initialFormState);
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
            const timeout = setTimeout(() => setIsMounted(false), 200);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    const resetForm = () => {
        setForm(initialFormState);
        setError("");
        setServerError("");
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleClose = () => {
        if (isSubmitting) return;
        setIsVisible(false);
        setTimeout(() => onClose(), 180);
    };

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        if (!form.name.trim()) {
            setError("Tên ví là bắt buộc");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setServerError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }
        try {
            setIsSubmitting(true);
            setServerError("");
            const payload = {
                userId: JSON.parse(userId),
                name: form.name.trim(),
                description: form.description.trim(),
                icon: ":wallet:",
                default_balance: 0,
                current_balance: 0,
            };
            const response = await UserService.createWallet(payload);
            onCreated?.(response.data);
            handleClose();
        } catch (err) {
            setServerError("Không thể tạo ví. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
                onClick={handleClose}
            />
            <form
                onSubmit={handleSubmit}
                className={`relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            >
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Create New Wallet</h2>
                    <p className="text-sm text-gray-500 mt-1">Quản lý thu chi theo từng ví riêng biệt.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tên ví <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Ví tiền mặt, Ví ngân hàng..."
                            value={form.name}
                            onChange={handleChange("name")}
                            disabled={isSubmitting}
                        />
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea
                            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            rows={3}
                            placeholder="Thông tin thêm về ví (tuỳ chọn)"
                            value={form.description}
                            onChange={handleChange("description")}
                            disabled={isSubmitting}
                        />
                    </div>
                    {serverError && (
                        <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                            {serverError}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button style={{borderRadius: '12px'}}
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                    >
                        {isSubmitting ? "Đang tạo..." : "Create Wallet"}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
}

