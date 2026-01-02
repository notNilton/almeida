import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    if (location.pathname === "/") return null;

    return (
        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link
                to="/"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
                <Home className="w-4 h-4" />
                Início
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                // Capitalize and format name
                const label = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

                return (
                    <div key={name} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-white/10" />
                        {isLast ? (
                            <span className="text-white font-bold text-sm tracking-tight">{label}</span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="hover:text-white transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
