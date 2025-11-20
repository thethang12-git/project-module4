interface WalletListProps {
    wallets: any[];
    isLoading: boolean;
}

export default function WalletList({ wallets, isLoading }: WalletListProps) {
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                    {[1, 2].map(key => (
                        <div key={key} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
                            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                            <div className="h-4 w-1/6 rounded bg-gray-200"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!wallets.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-6 text-center shadow-sm">
                <p className="text-gray-500">Chưa có ví nào. Bấm “Add Wallet” để tạo ví đầu tiên.</p>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Danh sách ví</h3>
                    <p className="text-sm text-gray-500">Theo dõi số dư từng ví</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-600">
                    {wallets.length} ví
                </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {wallets.map(wallet => (
                    <div key={wallet.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-base font-semibold text-gray-900">{wallet.name}</p>
                                {wallet.description && (
                                    <p className="text-sm text-gray-500">{wallet.description}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase text-gray-400">Current</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {(wallet.current_balance ?? 0).toLocaleString("vi-VN")} ₫
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

