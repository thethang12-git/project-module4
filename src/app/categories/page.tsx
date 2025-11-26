"use client"
import { useEffect, useState } from "react"
import UserService from "@/src/service/dataService"
import { Category } from "@/src/types/category"
import CategoryCard from "@/src/components/categories/CategoryCard"
import CategoryFormModal from "@/src/components/categories/CategoryFormModal"
import HeaderHome from "@/src/components/home/HeaderHome"

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [modalType, setModalType] = useState<"expense" | "income">("expense")

    function loadCategories() {
        const userId = localStorage.getItem("userId")
        if (userId === null) {
            setLoading(false)
            return
        }
        const trueId = JSON.parse(userId)
        const userIdNumber = Number(trueId)
        setLoading(true)
        UserService.getCategories(userIdNumber)
            .then(function handleSuccess(res) {
                setCategories(res.data)
            })
            .catch(function handleError(err) {
                console.log(err)
            })
            .finally(function handleFinally() {
                setLoading(false)
            })
    }

    useEffect(function loadCategoriesOnMount() {
        loadCategories()
    }, [])

    function handleCategoryClick(categoryId: string) {
        if (selectedCategoryId === categoryId) {
            setSelectedCategoryId(null)
        } else {
            setSelectedCategoryId(categoryId)
        }
    }

    function handleCategoryCardClick(category: Category) {
        handleCategoryClick(category.id)
    }

    function handleAddCategory() {
        setEditingCategory(null)
        setModalType("expense")
        setIsModalOpen(true)
    }

    function handleEditCategory(category: Category) {
        setEditingCategory(category)
        if (category.is_income === true) {
            setModalType("income")
        } else {
            setModalType("expense")
        }
        setIsModalOpen(true)
    }

    function handleSaveCategory(categoryData: { name: string; note: string; is_income: boolean }) {
        const userId = localStorage.getItem("userId")
        if (userId === null) {
            alert("Vui lòng đăng nhập")
            return
        }
        const trueId = JSON.parse(userId)
        const userIdNumber = Number(trueId)
        
        if (editingCategory !== null && editingCategory !== undefined) {
            const updateData = {
                id: editingCategory.id,
                userId: userIdNumber,
                name: categoryData.name,
                is_income: categoryData.is_income,
                note: categoryData.note
            }
            UserService.updateCategory(editingCategory.id, updateData)
                .then(function handleSuccess() {
                    setIsModalOpen(false)
                    setEditingCategory(null)
                    loadCategories()
                })
                .catch(function handleError(err) {
                    console.log(err)
                    alert("Có lỗi xảy ra khi cập nhật danh mục")
                })
        } else {
            const newCategory = {
                userId: userIdNumber,
                name: categoryData.name,
                is_income: categoryData.is_income,
                note: categoryData.note
            }
            UserService.addCategory(newCategory)
                .then(function handleSuccess() {
                    setIsModalOpen(false)
                    setEditingCategory(null)
                    loadCategories()
                })
                .catch(function handleError(err) {
                    console.log(err)
                    alert("Có lỗi xảy ra khi thêm danh mục")
                })
        }
    }

    function handleDeleteCategory(category: Category) {
        UserService.deleteCategory(category.id)
            .then(function handleSuccess() {
                loadCategories()
            })
            .catch(function handleError(err) {
                console.log(err)
                alert("Có lỗi xảy ra khi xóa danh mục")
            })
    }

    function handleCloseModal() {
        setIsModalOpen(false)
        setEditingCategory(null)
    }

    const isModalIncome = modalType === "income"

    const incomeCategories = categories.filter(function(cat) { return cat.is_income === true })
    const expenseCategories = categories.filter(function(cat) { return cat.is_income === false })

    return (
        <div className="min-h-screen bg-white">
            <HeaderHome />
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Categories
                        </h1>
                    </div>
                    <button
                        style={{borderRadius:'9px'}}
                        onClick={handleAddCategory}
                        className=" px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <span  className="flex items-center gap-2 ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Thêm mới
                        </span>
                    </button>
                </div>
                
                {loading === true ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500 mt-4">Đang tải danh mục...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-lg text-gray-500">Chưa có danh mục nào</p>
                        <p className="text-sm text-gray-400 mt-2">Hãy thêm danh mục đầu tiên của bạn</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-green-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Thu nhập</h2>
                                    <p className="text-sm text-gray-500">{incomeCategories.length} danh mục</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {incomeCategories.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-8">Chưa có danh mục thu nhập</p>
                                ) : (
                                    incomeCategories.map(function renderCategory(category) {
                                        return (
                                            <CategoryCard 
                                                key={category.id} 
                                                category={category}
                                                onClick={function() {
                                                    handleCategoryCardClick(category)
                                                }}
                                                onEdit={function() {
                                                    handleEditCategory(category)
                                                }}
                                                onDelete={function() {
                                                    handleDeleteCategory(category)
                                                }}
                                                isSelected={selectedCategoryId === category.id}
                                            />
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-t-4 border-red-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Chi tiêu</h2>
                                    <p className="text-sm text-gray-500">{expenseCategories.length} danh mục</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {expenseCategories.length === 0 ? (
                                    <p className="text-sm text-gray-400 text-center py-8">Chưa có danh mục chi tiêu</p>
                                ) : (
                                    expenseCategories.map(function renderCategory(category) {
                                        return (
                                            <CategoryCard 
                                                key={category.id} 
                                                category={category}
                                                onClick={function() {
                                                    handleCategoryCardClick(category)
                                                }}
                                                onEdit={function() {
                                                    handleEditCategory(category)
                                                }}
                                                onDelete={function() {
                                                    handleDeleteCategory(category)
                                                }}
                                                isSelected={selectedCategoryId === category.id}
                                            />
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <CategoryFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCategory}
                editingCategory={editingCategory}
                isIncome={isModalIncome}
            />
        </div>
    )
}