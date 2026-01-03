import { Bell, User, ArrowLeft } from "lucide-react";
import { useHeader } from "./HeaderContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../modules/auth/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Breadcrumbs } from "./Breadcrumbs";

export function Header() {
    const { header } = useHeader();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleBack = () => {
        if (header.onBack) {
            header.onBack();
        } else if (header.backPath) {
            navigate(header.backPath);
        }
    };

    return (
        <header className="h-16 border-b border-white/5 glass sticky top-0 z-30 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                {(header.backPath || header.onBack) && (
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors mr-2"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                )}
                <div className="flex flex-col">
                    <Breadcrumbs />
                    {header.subtitle && (
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mt-1">
                            {header.subtitle}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {header.actions && (
                    <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
                        {header.actions}
                    </div>
                )}
                <ThemeToggle />
                <button className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                </button>
                <Link
                    to="/profile"
                    className="flex items-center gap-3 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Usuário'}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight uppercase font-medium">{user?.role}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 overflow-hidden border border-white/10 flex items-center justify-center">
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-black" />
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}
