"use client"
import React from "react";

export default function SearchList({ query, searchList, setSearchList }: any) {
    return (
        <div
            style={{ transformOrigin: "top" }}
            className={`transition-all duration-300 ease-in-out p-6 text-gray-700 max-h-[60vh] overflow-x-hidden overflow-y-auto ${
                query.trim() === "" ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"
            }`}
        >
            {query.trim() === "" ? (
                <span className="text-gray-400">Trống</span>
            ) : (
                <div className="flex flex-col w-full gap-4">
                    {searchList.length === 0 ? (
                        <span className="text-gray-400">Không tìm thấy kết quả</span>
                    ) : (
                        searchList.map((item: any) => (
                            <div
                                key={item.id}
                                className="w-full bg-white p-5 rounded-lg shadow-md flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                        🍔
                                    </div>
                                    <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </span>
                                        <span className="text-sm text-gray-500">{item.note}</span>
                                    </div>
                                </div>

                                <div className="text-right">
                  <span
                      className={`font-bold ${
                          item.money < 0 ? "text-red-500" : "text-green-500"
                      }`}
                  >
                    {item.money} {item.currency}
                  </span>
                                    <div className="text-sm text-gray-400">{item.date}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
