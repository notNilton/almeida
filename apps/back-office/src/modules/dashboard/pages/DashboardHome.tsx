import { useEmployees } from "../../employees/hooks/useEmployees";
import { useContracts } from "../../employees/hooks/useContracts";
import { useDocuments } from "../../documents/hooks/useDocuments";
import { useEffect } from "react";
import { useHeader } from "../../../components/layout/HeaderContext";
import { Users, FileText, ClipboardList, Clock, ArrowUpRight, UserPlus, Upload, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";

export function DashboardHome() {
    const { data: employees } = useEmployees();
    const { data: contracts } = useContracts();
    const { data: documents } = useDocuments();
    const { setHeader, resetHeader } = useHeader();

    useEffect(() => {
        setHeader({
            title: 'Visão Geral',
            subtitle: 'Resumo das atividades e métricas'
        });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    const stats = [
        {
            label: "Funcionários",
            value: employees?.length.toString() || "0",
            color: "text-blue-500",
            icon: Users,
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            link: "/funcionarios"
        },
        {
            label: "Contratos Ativos",
            value: contracts?.filter(c => c.status === 'ACTIVE').length.toString() || "0",
            color: "text-purple-500",
            icon: ClipboardList,
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            link: "/contratos"
        },
        {
            label: "Documentos",
            value: documents?.length.toString() || "0",
            color: "text-emerald-500",
            icon: FileText,
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            link: "/documentos"
        },
        {
            label: "Aguardando OCR",
            value: documents?.filter(d => d.status === 'PENDING').length.toString() || "0",
            color: "text-amber-500",
            icon: Clock,
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            link: "/documentos"
        },
    ];

    return (
        <div className="space-y-8 pb-12 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link
                        to={stat.link}
                        key={stat.label}
                        className="group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[2rem]"
                    >
                        <div className="glass p-6 rounded-[2rem] border border-white/5 group-hover:border-white/10 transition-all relative overflow-hidden h-full">
                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                                <stat.icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
                            </div>

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={cn("p-3 rounded-2xl border", stat.bg, stat.color, stat.border)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-4xl font-black text-white mb-1 tracking-tight">{stat.value}</p>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Últimos Cadastros
                        </h2>
                        <Link to="/funcionarios" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
                            Ver todos
                        </Link>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
                            <div className="col-span-7">Funcionário</div>
                            <div className="col-span-5 text-right">Status</div>
                        </div>

                        <div className="space-y-1">
                            {employees?.slice(0, 5).map((employee) => (
                                <div key={employee.id} className="group grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-2xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5 cursor-pointer">
                                    <div className="col-span-7 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center border border-white/5 text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-sm text-white truncate">{employee.name}</div>
                                            <div className="text-[10px] text-muted-foreground font-mono opacity-50">#{employee.id.slice(0, 8)}</div>
                                        </div>
                                    </div>

                                    <div className="col-span-5 flex justify-end">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border",
                                            employee.status === 'ACTIVE'
                                                ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                                                : "bg-red-500/5 text-red-500 border-red-500/20"
                                        )}>
                                            {employee.status === 'ACTIVE' ? "Ativo" : "Inativo"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!employees || employees.length === 0) && (
                                <div className="py-12 text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted-foreground/30">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Nenhum funcionário cadastrado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white px-2 flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        Acesso Rápido
                    </h2>

                    <div className="grid grid-cols-1 gap-3">
                        <Link to="/funcionarios/novo" className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <div className="font-bold text-sm">Novo Funcionário</div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                        </Link>

                        <Link to="/documentos" className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div className="font-bold text-sm">Upload Documento</div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                        </Link>

                        <Link to="/contratos" className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <div className="font-bold text-sm">Ver Contratos</div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
