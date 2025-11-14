import React from "react";
import {Metadata} from "next";
import "./globals.css";
import Providers from '../store/provider';
import InitUser from "@/src/app/initUser";
import Popup from "@/src/components/popUp";

export const metadata: Metadata = {
  title: "Project",
  description: "Module 4 final project",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
      <Providers >
          <InitUser/>
          {children}
      </Providers>
      </body>
    </html>
  );
}
