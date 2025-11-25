"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import PersonIcon from "@mui/icons-material/Person"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import CategoryIcon from "@mui/icons-material/Category"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"

interface UserDropdownProps {
    isOpen: boolean
    onClose: () => void
    avatar: string | null
    username: string
    email: string
}

export default function UserDropdown({
    isOpen,
    onClose,
    avatar,
    username,
    email,
}: UserDropdownProps) {
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    // Get first letter of username for avatar fallback
    const getInitial = (name: string) => {
        if (!name) return "N"
        return name.charAt(0).toUpperCase()
    }

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    const handleLogout = () => {
        setIsLoggingOut(true)
        localStorage.clear()
        setTimeout(() => {
            router.push("/login")
        }, 500)
    }

    const handleMenuClick = (path: string) => {
        router.push(path)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-gray-200 bg-white shadow-2xl z-50 overflow-hidden"
        >
            {/* Account Info Section */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                <div className="text-xs font-semibold text-green-600 mb-3">BASIC ACCOUNT</div>
                <div className="flex items-center gap-3">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={username}
                            className="h-14 w-14 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-14 w-14 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold">
                            {getInitial(username)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">
                            {username}
                        </div>
                        <div className="text-xs text-gray-500 truncate italic">
                            {email}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
                <button
                    onClick={() => handleMenuClick("/")}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <PersonIcon className="text-gray-500" fontSize="small" />
                    <span className="text-sm font-medium">My Account</span>
                </button>
                <button
                    onClick={() => handleMenuClick("/wallets")}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <AccountBalanceWalletIcon className="text-gray-500" fontSize="small" />
                    <span className="text-sm font-medium">My Wallets</span>
                </button>
                <button
                    onClick={() => handleMenuClick("/categories")}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <CategoryIcon className="text-gray-500" fontSize="small" />
                    <span className="text-sm font-medium">Categories</span>
                </button>
            </div>

            {/* Log Out Button */}
            <div className="border-t border-gray-100 p-2">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left text-red-600 hover:bg-red-50 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ExitToAppIcon fontSize="small" className="text-red-600" />
                    <span className="text-sm font-medium">Log Out</span>
                </button>
            </div>
        </div>
    )
}

