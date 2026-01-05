import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    FileSignature,
    UserCircle
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../modules/auth/contexts/AuthContext";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ['ADMIN', 'USER', 'VIEWER'] },
    { name: "Funcionários", href: "/funcionarios", icon: Users, roles: ['ADMIN', 'USER', 'VIEWER'] },
    { name: "Contratos", href: "/contratos", icon: FileSignature, roles: ['ADMIN', 'USER', 'VIEWER'] },
    { name: "Documentos", href: "/documentos", icon: FileText, roles: ['ADMIN', 'USER', 'VIEWER'] },
    { name: "Gestão de Usuários", href: "/usuarios", icon: UserCircle, roles: ['ADMIN'] },
];

import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
    const location = useLocation();
    const { logout, user } = useAuth();

    const filteredNavigation = navigation.filter(item =>
        !item.roles || item.roles.includes(user?.role || 'VIEWER')
    );

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r border-white/10 flex flex-col">
            <div className="p-6">
                <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-black font-black text-xs">AL</span>
                    </div>
                    Almeida
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1 py-4">
                {filteredNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/10 text-white shadow-lg"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-muted-foreground")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-1">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sair
                </button>
            </div>
        </aside>
    );
}
