"use client"
import React, {useRef, useState} from "react";
import {HiOutlineMagnifyingGlass} from "react-icons/hi2";
import {createPortal} from "react-dom";
import HintList from "./hintList/hintList";
import SearchList from "@/src/components/search/hintList/searchList";
import {useSelector} from "react-redux";
import {RootState} from "@/src/store/store";
function normalizeStr(str: string) {
    return str
        .normalize("NFD") // tách chữ và dấu
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .toLowerCase()
        .trim();
}
export default function SearchModal() {
    const transactions = useSelector((state: RootState) => state.transactions.list);
    const [searchList,setSearchList] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [query, setQuery] = useState("");
    const [scale, setScale] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const openModal = () => {
        setIsOpen(true);
        setTimeout(() => setShow(true), 10);
        setTimeout(() => inputRef.current?.focus() , 100);
    };

    const closeModal = () => {
        setShow(false);
        setTimeout(() => setIsOpen(false), 200);
    };

    const handleFocus = () => {
        setScale(true);
        setTimeout(() => setScale(false), 200); // Scale lại về bình thường sau 200ms
    };

    const [temporary, setTemporary] = useState(transactions);
    const prevWordsRef = useRef<string[]>([]);
    const handleSearch = (q: string) => {
        const queryNorm = normalizeStr(q);
        if(q.length === 0 || q.includes('/')){
            setSearchList(transactions);
            setTemporary(transactions);
            prevWordsRef.current = [];
            return;
        }
        const currentWords = queryNorm.split(/\s+/)
        let sourceList = transactions;
        if(
            currentWords.length > prevWordsRef.current.length &&
            currentWords.slice(0, prevWordsRef.current.length).join(' ') === prevWordsRef.current.join(' ')
        ) {
            sourceList = temporary;
        }
        const newSearch = sourceList.filter((itm : any) => {
            const name = normalizeStr(itm.name);
            const note = normalizeStr(itm.note);
            return currentWords.every(word => name.includes(word) || note.includes(word));
        });
        setSearchList(newSearch);
        setTemporary(newSearch);
        prevWordsRef.current = currentWords;
    };


    return (
        <>
            <button
                onClick={openModal}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md group"
                aria-label="Search"
            >
                <HiOutlineMagnifyingGlass className="text-xl text-gray-600 group-hover:text-orange-600 transition-colors" />
            </button>

            {isOpen && createPortal(
                <div className="fixed inset-0 z-50 flex items-start justify-center m-0 ">
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black transition-opacity ${
                            show ? "opacity-50" : "opacity-0"
                        }`}
                        onClick={closeModal}
                    ></div>

                    {/* Modal Panel */}
                    <div
                        className={`bg-white rounded-3xl shadow-md max-w-3xl w-full mx-4 z-50 transform transition-all duration-200 ${
                            show ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        } ${scale ? "scale-105" : ""}`}
                        style={{ marginTop: "10%" }}
                    >
                        {/* Header with input */}
                        <div style={{padding:'16px 24px 10px 24px'}} className="flex flex-col justify-between items-center relative">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search..."
                                value={query}
                                onChange={(e) =>
                                {   setQuery(e.target.value);
                                    handleSearch(e.target.value);
                                }}
                                onFocus={handleFocus}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-transform duration-200"
                            />
                            {/*<div style={{position:"absolute", left:'10%',top:'100%',width:'360px',zIndex:'10',display:query.includes('/') || query === "" ? "none" : "block" }}>*/}
                            {/*    <HintList hintList={hintList} setHintList={setHintList} />*/}
                            {/*</div>*/}
                        </div>

                        {/* Body */}
                        <SearchList searchList={searchList} setSearchList={setSearchList}  query={query}/>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 px-6 py-4">
                            <button
                                onClick={closeModal}
                                style={{borderRadius:'8px'}}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md shadow-sm transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert("Confirmed!");
                                    closeModal();
                                }}
                                style={{borderRadius: '8px'}}
                                className=" px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-all duration-200"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>, document.body
            )
            }
        </>
    )
}
