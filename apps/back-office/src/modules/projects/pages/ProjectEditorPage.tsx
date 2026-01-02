import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { Save, Image as ImageIcon, Loader2, Upload, X, Globe, Settings, Eye } from "lucide-react";
import { useProjectById, useCreateProject, useUpdateProject } from "../hooks/useProjects";
import type { Project } from "../types/project";
import api from "../../../lib/api";
import { useHeader } from "../../../components/layout/HeaderContext";

export function ProjectEditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const { setHeader, resetHeader } = useHeader();

    const { data: project, isLoading: isLoadingProject } = useProjectById(id);
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();

    const [formData, setFormData] = useState<Omit<Project, 'id' | 'views'>>({
        title: '',
        description: '',
        fullDescription: '',
        category: 'Social',
        imageId: undefined,
        image: undefined,
        date: new Date().toISOString().split('T')[0],
        status: 'PUBLISHED',
        publishedAt: undefined,
        seoTitle: '',
        seoDescription: '',
    });
    const [loadedId, setLoadedId] = useState<string | null>(null);

    const resetForm = useCallback(() => {
        setFormData({
            title: '',
            description: '',
            fullDescription: '',
            category: 'Social',
            imageId: undefined,
            image: undefined,
            date: new Date().toISOString().split('T')[0],
            status: 'PUBLISHED',
            publishedAt: undefined,
            seoTitle: '',
            seoDescription: '',
        });
        setLoadedId(null);
    }, []);

    useEffect(() => {
        if (!id) {
            resetForm();
        }
    }, [id, resetForm]);

    useEffect(() => {
        if (project && id && String(project.id) === id && loadedId !== id) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                fullDescription: project.fullDescription || '',
                category: project.category || 'Social',
                imageId: project.imageId ?? undefined,
                image: project.image ?? undefined,
                date: project.date && !isNaN(Date.parse(project.date))
                    ? new Date(project.date).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                status: project.status || 'PUBLISHED',
                publishedAt: project.publishedAt ?? undefined,
                seoTitle: project.seoTitle || '',
                seoDescription: project.seoDescription || '',
            });
            setLoadedId(id);
        }
    }, [project, id, loadedId]);

    const handleSave = useCallback(async () => {
        try {
            const { image, ...payload } = formData;

            if (isEditing) {
                await updateProject.mutateAsync({
                    ...payload,
                    id: Number(id),
                    publishedAt: payload.publishedAt ? new Date(payload.publishedAt).toISOString() : undefined
                } as Project);
            } else {
                await createProject.mutateAsync({
                    ...payload,
                    publishedAt: payload.publishedAt ? new Date(payload.publishedAt).toISOString() : undefined
                } as Omit<Project, 'id'>);
            }
            navigate('/projects');
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Erro ao salvar projeto.');
        }
    }, [isEditing, id, formData, updateProject, createProject, navigate]);

    const isSaving = createProject.isPending || updateProject.isPending;

    useEffect(() => {
        const title = isEditing
            ? `Editar: ${formData.title || project?.title || '...'}`
            : 'Novo Projeto';

        setHeader({
            title,
            backPath: isEditing ? `/projects/${id}` : '/projects',
            actions: (
                <div className="flex items-center gap-3">
                    {isEditing && (
                        <button
                            onClick={() => navigate(`/projects/${id}`)}
                            className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-lg font-bold hover:bg-white/10 transition-all text-sm border border-white/10"
                        >
                            <Eye className="w-4 h-4" />
                            Visualizar
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-50 text-sm"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Salvar
                    </button>
                </div>
            )
        });

        return () => resetHeader();
    }, [isEditing, formData.title, project?.title, isSaving, handleSave, setHeader, resetHeader]);

    const onUploadImg = useCallback(async (files: File[], callback: (urls: string[]) => void) => {
        try {
            const res = await Promise.all(
                files.map((file) => {
                    return new Promise((rev, rej) => {
                        const form = new FormData();
                        form.append('file', file);

                        api.post('/uploads', form)
                            .then((res) => rev(res.data.url))
                            .catch((err) => rej(err));
                    });
                })
            );
            callback(res as string[]);
        } catch (error: any) {
            console.error('Error uploading md images:', error);
            const message = error.response?.data?.message || error.message || 'Erro desconhecido';
            alert(`Erro ao carregar imagens do editor: ${message}`);
        }
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const form = new FormData();
                form.append('file', file);
                const res = await api.post('/uploads', form);
                const uploadData = res.data;
                setFormData(prev => ({
                    ...prev,
                    imageId: uploadData.id,
                    image: uploadData
                }));
            } catch (error: any) {
                console.error('Error uploading cover image:', error);
                const message = error.response?.data?.message || error.message || 'Erro desconhecido';
                alert(`Erro ao carregar imagem de capa: ${message}`);
            }
        }
    };

    if (isLoadingProject && isEditing) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="relative w-full rounded-2xl overflow-hidden glass border border-white/5 group min-h-[200px] flex items-center justify-center bg-white/5">
                {formData.image ? (
                    <>
                        <img src={formData.image.url} alt="Capa" className="w-full h-auto max-h-[600px] object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <label className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-white/90 transition-all text-sm">
                                <Upload className="w-4 h-4" />
                                Alterar Capa
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, image: undefined, imageId: undefined }))}
                                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-all text-sm"
                            >
                                <X className="w-4 h-4" />
                                Remover
                            </button>
                        </div>
                    </>
                ) : (
                    <label className="w-full py-12 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-muted-foreground">Adicionar Imagem de Capa</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Clique para selecionar</p>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Título do Projeto</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="Digite o título do projeto..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Conteúdo (Markdown)</label>
                            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                                <MdEditor
                                    theme="dark"
                                    modelValue={formData.fullDescription}
                                    onChange={(val: string) => setFormData({ ...formData, fullDescription: val })}
                                    onUploadImg={onUploadImg}
                                    style={{ height: '600px' }}
                                    language="en-US"
                                    previewTheme="github"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Settings className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Publicação</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="PUBLISHED">Publicado</option>
                                <option value="DRAFT">Rascunho</option>
                                <option value="SCHEDULED">Agendado</option>
                            </select>
                        </div>

                        {formData.status === 'SCHEDULED' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Data de Publicação</label>
                                <input
                                    type="datetime-local"
                                    value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        )}
                    </div>

                    <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">SEO & Meta</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">SEO Title</label>
                            <input
                                type="text"
                                value={formData.seoTitle}
                                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Deixe vazio para usar o título real"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">SEO Description</label>
                            <textarea
                                value={formData.seoDescription}
                                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                rows={3}
                                placeholder="Resumo para o Google..."
                            />
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Search Preview</p>
                            <div className="bg-white p-4 rounded-lg text-black space-y-1 shadow-inner">
                                <div className="text-[#1a0dab] text-lg font-medium leading-tight truncate">
                                    {formData.seoTitle || formData.title || 'Título do Projeto'}
                                </div>
                                <div className="text-[#006621] text-sm leading-tight truncate">
                                    https://icctes.org/projetos/{id || 'novo-projeto'}
                                </div>
                                <div className="text-[#4d5156] text-sm leading-snug line-clamp-2">
                                    {formData.seoDescription || (formData.fullDescription ? formData.fullDescription.slice(0, 160) + '...' : 'Sem descrição disponível.')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
