"use client"
import { useState, useEffect } from "react"
import { Category } from "@/src/types/category"

type CategoryFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (categoryData: { name: string; note: string; is_income: boolean }) => void;
    editingCategory?: Category | null;
    isIncome: boolean;
};

export default function CategoryFormModal(props: CategoryFormModalProps) {
    const isOpen = props.isOpen;
    const onClose = props.onClose;
    const onSave = props.onSave;
    const editingCategory = props.editingCategory;
    const isIncome = props.isIncome;
    
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [selectedType, setSelectedType] = useState<"income" | "expense">(isIncome ? "income" : "expense");
    
    useEffect(function initializeForm() {
        if (editingCategory !== null && editingCategory !== undefined) {
            setName(editingCategory.name);
            if (editingCategory.note !== undefined && editingCategory.note !== null) {
                setNote(editingCategory.note);
            } else {
                setNote("");
            }
            if (editingCategory.is_income === true) {
                setSelectedType("income");
            } else {
                setSelectedType("expense");
            }
        } else {
            setName("");
            setNote("");
            setSelectedType(isIncome ? "income" : "expense");
        }
    }, [editingCategory, isOpen, isIncome]);
    
    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }
    
    function handleNoteChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setNote(event.target.value);
    }
    
    function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
        if (event.target.value === "income" || event.target.value === "expense") {
            setSelectedType(event.target.value);
        }
    }


    function handleSave() {
        if (name.trim() === "") {
            alert("Vui lòng nhập tên danh mục");
            return;
        }
        const isIncomeValue = selectedType === "income";
        onSave({
            name: name.trim(),
            note: note.trim(),
            is_income: isIncomeValue
        });
        setName("");
        setNote("");
    }
    
    function handleCancel() {
        setAnimation(false)
        setName("");
        setNote("");
        setTimeout(() => onClose(),300);
    }
    const [animation, setAnimation] = useState<boolean>(false);
    useEffect(() => {
        if(isOpen){
            setAnimation(true)
        }
        else {
            setAnimation(false);
        }
    }, [isOpen]);
    if (isOpen === false) {
        return null;
    }
    
    return (
        <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transform transition-all duration-500">
            <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all duration-400 ${animation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-100'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingCategory !== null && editingCategory !== undefined ? "Sửa danh mục" : "Thêm danh mục mới"}
                    </h2>
                </div>
                
                <div className="space-y-5">
                    {editingCategory === null || editingCategory === undefined ? (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Loại danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedType}
                                onChange={handleTypeChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="expense">💸 Chi tiêu</option>
                                <option value="income">💰 Thu nhập</option>
                            </select>
                        </div>
                    ) : null}
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Ví dụ: Ăn uống, Lương, Giải trí..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            value={note}
                            onChange={handleNoteChange}
                            placeholder="Thêm mô tả chi tiết cho danh mục (tùy chọn)"
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        />
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        style={{borderRadius:'8px'}}
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
                    >
                        Hủy
                    </button>
                    <button
                        style={{borderRadius:'8px'}}
                        onClick={handleSave}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        {editingCategory !== null && editingCategory !== undefined ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </div>
        </div>
    );
}

