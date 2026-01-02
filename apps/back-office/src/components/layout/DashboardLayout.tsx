import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { HeaderProvider } from "./HeaderContext";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <HeaderProvider>
            <div className="min-h-screen bg-background text-foreground flex">
                <Sidebar />
                <div className="flex-1 ml-64 flex flex-col">
                    <Header />
                    <main className="flex-1 p-8">
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </HeaderProvider>
    );
}
