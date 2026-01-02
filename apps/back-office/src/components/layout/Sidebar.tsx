import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    History,
    Users,
    FileText,
    LogOut,
    User,
    Shield
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../modules/auth/contexts/AuthContext";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { name: "Projetos", href: "/projects", icon: Briefcase, roles: ['ADMIN', 'EDITOR'] },
    { name: "História", href: "/history", icon: History, roles: ['ADMIN', 'EDITOR'] },
    { name: "Equipe", href: "/team", icon: Users, roles: ['ADMIN', 'EDITOR'] },
    { name: "Documentos", href: "/documents", icon: FileText, roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { name: "Perfil", href: "/profile", icon: User, roles: ['ADMIN', 'EDITOR', 'VIEWER'] },
    { name: "Usuários", href: "/users", icon: Users, roles: ['ADMIN'] },
    { name: "Configurações", href: "/settings", icon: Shield, roles: ['ADMIN'] },
];

export function Sidebar() {
    const location = useLocation();
    const { logout, user } = useAuth();

    const filteredNavigation = navigation.filter(item =>
        !item.roles || item.roles.includes(user?.role || 'VIEWER')
    );

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r border-white/10 flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-black font-black text-xs">IC</span>
                    </div>
                    Back-office
                </h1>
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
