import Providers from "../lib/provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="w-full bg-[#140929] text-white shadow-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold">IVX Trade</h1>
            <nav className="space-x-4">
            </nav>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-grow bg-[#0b021d]">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
        
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
