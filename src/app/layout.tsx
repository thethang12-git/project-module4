import "./globals.css"
import React from "react";
import {Metadata} from "next";

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
        {children}
      </body>
    </html>
  );
}
