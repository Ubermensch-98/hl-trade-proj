import React from "react";
import Providers from "../lib/provider";
import ConnectButton from "@/components/ConnectButton";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="w-full bg-[#140929] text-white shadow-md">
          <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              {/* Logo scales with viewport height; width stays auto → aspect ratio preserved */}
              <Image
                src="/logo.svg"
                alt="IVX Trade"
                width={48}
                height={48}
                className="h-[clamp(24px,6vh,48px)] w-auto"
              />
              <span className="text-xl font-bold leading-none">IVX Trade</span>
            </Link>

            <nav className="space-x-4">
            </nav>
            <ConnectButton />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-grow bg-[#0b021d]">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
        <Toaster
          duration={2000}
        />

        {/* Footer */}
        <footer className="w-full flex flex-col bg-[#140929] text-white">
          <div className="max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <p className="font-mono">© 2025 IVX. Some Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </Providers>
  );
}
