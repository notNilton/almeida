import { Plus, Search, Briefcase, Pencil, Trash2 } from "lucide-react";
import { useProjects, useDeleteProject } from "../hooks/useProjects";
import type { Project } from "../types/project";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useHeader } from "../../../components/layout/HeaderContext";
import { useDebounce } from "../../../hooks/useDebounce";
import { toast } from "sonner";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Skeleton } from "../../../components/ui/skeleton/Skeleton";

export function ProjectsPage() {
    const [filters, setFilters] = useState({
        search: '',
        category: 'All',
        status: 'All'
    });
    const [confirmDelete, setConfirmDelete] = useState<{ id: number; isOpen: boolean }>({ id: 0, isOpen: false });
    const debouncedSearch = useDebounce(filters.search, 500);

    const { data: projects, isLoading, isError } = useProjects({
        ...filters,
        search: debouncedSearch
    });
    const deleteProject = useDeleteProject();
    const navigate = useNavigate();

    const handleCreate = () => {
        navigate('/projects/new');
    };

    const handleEdit = (project: Project) => {
        navigate(`/projects/${project.id}/edit`);
    };

    const handleDelete = useCallback(async () => {
        if (confirmDelete.id) {
            try {
                await deleteProject.mutateAsync(confirmDelete.id);
                toast.success('Projeto excluído com sucesso!');
            } catch (error) {
                toast.error('Erro ao excluir projeto.');
            } finally {
                setConfirmDelete({ id: 0, isOpen: false });
            }
        }
    }, [confirmDelete.id, deleteProject]);

    const { setHeader, resetHeader } = useHeader();

    useEffect(() => {
        setHeader({
            title: 'Projetos',
            actions: (
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Novo Projeto
                </button>
            )
        });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    return (
        <div className="space-y-6">
            <ConfirmDialog
                isOpen={confirmDelete.isOpen}
                title="Excluir Projeto"
                message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                isDestructive
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete({ id: 0, isOpen: false })}
            />

            <div className="flex items-center gap-4 py-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar projetos..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>

                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                >
                    <option value="All">Todas Categorias</option>
                    <option value="Social">Social</option>
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Cultura">Cultura</option>
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                >
                    <option value="All">Todos Status</option>
                    <option value="PUBLISHED">Publicado</option>
                    <option value="DRAFT">Rascunho</option>
                    <option value="SCHEDULED">Agendado</option>
                </select>
            </div>

            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                {isError ? (
                    <div className="p-8 text-center text-red-500">Erro ao carregar projetos.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold">Projeto</th>
                                <th className="px-6 py-4 text-sm font-semibold text-center">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-center">Data</th>
                                <th className="px-6 py-4 text-sm font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="w-12 h-12 rounded-lg" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-32" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-20 mx-auto" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : (
                                projects?.map((project: Project) => (
                                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {project.image ? (
                                                    <img src={project.image.url} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10 shadow-sm" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <Link to={`/projects/${project.id}`} className="flex flex-col group/title">
                                                    <span className="font-bold text-white group-hover/title:text-primary transition-colors">{project.title}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{project.category}</span>
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${project.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                project.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {project.status === 'PUBLISHED' ? 'Publicado' :
                                                    project.status === 'DRAFT' ? 'Rascunho' : 'Agendado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-muted-foreground">{project.date || '---'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDelete({ id: project.id, isOpen: true })}
                                                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {!isLoading && projects?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                                        Nenhum projeto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
