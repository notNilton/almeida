import { useProjects } from "../../projects/hooks/useProjects";
import { useTeam } from "../../team/hooks/useTeam";
import { useHistory } from "../../history/hooks/useHistory";
import { useDocuments } from "../../documents/hooks/useDocuments";
import { useEffect, useMemo } from "react";
import { useHeader } from "../../../components/layout/HeaderContext";
import { Briefcase, Users, FileText, History as HistoryIcon, Eye, ArrowUpRight } from "lucide-react";

export function DashboardHome() {
    const { data: projects } = useProjects();
    const { data: team } = useTeam();
    const { data: documents } = useDocuments();
    const { setHeader, resetHeader } = useHeader();

    useEffect(() => {
        setHeader({ title: 'Resumo de Impacto' });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    const totalViews = useMemo(() => {
        return projects?.reduce((acc, p: any) => acc + (p.views || 0), 0) || 0;
    }, [projects]);

    const stats = [
        { label: "Projetos Ativos", value: projects?.length.toString() || "0", color: "text-blue-500", icon: Briefcase, bg: "bg-blue-500/10" },
        { label: "Colaboradores", value: team?.length.toString() || "0", color: "text-purple-500", icon: Users, bg: "bg-purple-500/10" },
        { label: "Documentos", value: documents?.length.toString() || "0", color: "text-emerald-500", icon: FileText, bg: "bg-emerald-500/10" },
        { label: "Visualizações", value: totalViews.toString(), color: "text-amber-500", icon: Eye, bg: "bg-amber-500/10" },
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
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl border border-white/5 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Últimos Projetos</h2>
                    </div>
                    <div className="space-y-4">
                        {projects?.slice(0, 4).map((project: any) => (
                            <div key={project.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{project.title}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{project.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium flex items-center gap-1">
                                        <Eye className="w-3 h-3 text-muted-foreground" />
                                        {project.views || 0}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-2xl border border-white/5 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <HistoryIcon className="w-5 h-5 text-primary" />
                        Ações Rápidas
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        <button className="p-4 rounded-xl bg-primary text-black font-bold text-sm hover:opacity-90 transition-all flex items-center justify-between">
                            Novo Projeto
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-between">
                            Enviar Documento
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
