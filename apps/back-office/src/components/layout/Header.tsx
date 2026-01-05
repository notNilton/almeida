import { User, ArrowLeft, Search } from "lucide-react";
import { useHeader } from "./HeaderContext";
import { useNavigate } from "react-router-dom";
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

            <div className="flex-1 max-w-xl mx-8 hidden md:block">
                {header.search ? (
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={header.search.value}
                            onChange={(e) => header.search?.onChange(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-slate-300 placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/10 sm:text-sm transition-all"
                            placeholder={header.search.placeholder || "Buscar..."}
                        />
                    </div>
                ) : header.tabs ? (
                    <div className="flex justify-center">
                        {header.tabs}
                    </div>
                ) : null}
            </div>

            <div className="flex items-center gap-4">
                {header.actions && (
                    <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-4">
                        {header.actions}
                    </div>
                )}
                <ThemeToggle />
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Usuário'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 overflow-hidden border border-white/10 flex items-center justify-center">
                        {user?.avatar?.url ? (
                            <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-black" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
