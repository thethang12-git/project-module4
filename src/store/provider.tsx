'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import React, {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";

interface ProvidersProps {
    children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isLoginPage = pathname === '/login' || (pathname === '/register');
    useEffect(() => {
        if (isLoginPage) return
        const currentUser = localStorage.getItem('email');
        if(currentUser) {
            console.log('xin chào' + ' ' + currentUser);
        }
        else {
            alert('không có sidebarHeader, chuyển trang đăng nhập ....')
            router.push('/login');
        }
    }, []);
    return <Provider store={store}>{children}</Provider>;
}

export default Providers
