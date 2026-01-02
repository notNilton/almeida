import { useParams, useNavigate } from "react-router-dom";
import { useProjectById } from "../hooks/useProjects";
import { Pencil, Calendar, Tag, Eye, Globe, Clock, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useHeader } from "../../../components/layout/HeaderContext";
import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

export function ProjectViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: project, isLoading } = useProjectById(id);
    const { setHeader, resetHeader } = useHeader();

    useEffect(() => {
        if (project) {
            setHeader({
                title: project.title,
                backPath: '/projects',
                actions: (
                    <button
                        onClick={() => navigate(`/projects/${id}/edit`)}
                        className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-sm"
                    >
                        <Pencil className="w-4 h-4" />
                        Editar Projeto
                    </button>
                )
            });
        }
        return () => resetHeader();
    }, [project, id, navigate, setHeader, resetHeader]);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Capa */}
            <div className="relative w-full rounded-3xl overflow-hidden glass border border-white/5 shadow-2xl overflow-hidden aspect-[21/9]">
                {project.image ? (
                    <img src={project.image.url} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                        <Tag className="w-20 h-20 text-primary/40" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <div className="flex flex-wrap gap-4 items-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${project.status === 'PUBLISHED' ? 'bg-emerald-500 text-white' :
                            project.status === 'DRAFT' ? 'bg-amber-500 text-black' : 'bg-blue-500 text-white'
                            }`}>
                            {project.status}
                        </span>
                        <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                            {project.date ? new Date(project.date).toLocaleDateString() : 'Sem data'}
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                            <Tag className="w-4 h-4" />
                            {project.category}
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            {project.views} Visualizações
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Conteúdo Principal */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                        <div>
                            <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-2">Resumo</h2>
                            <p className="text-xl text-white font-medium leading-relaxed">{project.description}</p>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-6">Conteúdo Completo</h2>
                            <div className="prose prose-invert max-w-none">
                                <MdPreview theme="dark" modelValue={project.fullDescription} language="en-US" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Informações</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Criado em
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {(project as any).createdAt ? new Date((project as any).createdAt).toLocaleDateString() : '---'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> SEO Title
                                </span>
                                <span className="text-sm font-bold text-white max-w-[120px] truncate">
                                    {project.seoTitle || 'Default'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 space-y-4">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest leading-relaxed">
                            Este projeto está visível para o público no portal principal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
