import { useEmployees } from "../../employees/hooks/useEmployees";
import { useContracts } from "../../employees/hooks/useContracts";
import { useDocuments } from "../../documents/hooks/useDocuments";
import { useEffect } from "react";
import { useHeader } from "../../../components/layout/HeaderContext";
import { Users, FileText, ClipboardList, Clock, ArrowUpRight, UserPlus, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardHome() {
    const { data: employees } = useEmployees();
    const { data: contracts } = useContracts();
    const { data: documents } = useDocuments();
    const { setHeader, resetHeader } = useHeader();

    useEffect(() => {
        setHeader({ title: 'Visão Geral' });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    const stats = [
        {
            label: "Funcionários",
            value: employees?.length.toString() || "0",
            color: "text-blue-500",
            icon: Users,
            bg: "bg-blue-500/10"
        },
        {
            label: "Contratos Ativos",
            value: contracts?.filter(c => c.status === 'ACTIVE').length.toString() || "0",
            color: "text-purple-500",
            icon: ClipboardList,
            bg: "bg-purple-500/10"
        },
        {
            label: "Documentos",
            value: documents?.length.toString() || "0",
            color: "text-emerald-500",
            icon: FileText,
            bg: "bg-emerald-500/10"
        },
        {
            label: "Aguardando OCR",
            value: documents?.filter(d => d.status === 'PENDING').length.toString() || "0",
            color: "text-amber-500",
            icon: Clock,
            bg: "bg-amber-500/10"
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass p-6 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1 text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl border border-white/5 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Últimos Funcionários</h2>
                        <Link to="/employees" className="text-xs text-primary hover:underline font-medium">Ver todos</Link>
                    </div>
                    <div className="space-y-4">
                        {employees?.slice(0, 5).map((employee) => (
                            <div key={employee.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white">{employee.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">CPF: {employee.cpf}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${employee.status === 'ACTIVE'
                                            ? "bg-emerald-500/10 text-emerald-500"
                                            : "bg-red-500/10 text-red-500"
                                        }`}>
                                        {employee.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!employees || employees.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center py-8">Nenhum funcionário cadastrado.</p>
                        )}
                    </div>
                </div>

                <div className="glass rounded-2xl border border-white/5 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        Ações Rápidas
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        <Link to="/employees" className="p-4 rounded-xl bg-primary text-black font-bold text-sm hover:opacity-90 transition-all flex items-center justify-between">
                            Gerenciar Funcionários
                            <UserPlus className="w-4 h-4" />
                        </Link>
                        <Link to="/documents" className="p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-between">
                            Upload de Documento
                            <Upload className="w-4 h-4" />
                        </Link>
                        <Link to="/contracts" className="p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-between">
                            Ver Contratos
                            <ClipboardList className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
