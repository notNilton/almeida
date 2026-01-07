import { useState, useEffect } from "react";
import { Plus, FileText, Download, Trash2, Pencil, Search } from "lucide-react";
import { useHeader } from "../../../components/layout/HeaderContext";
import { cn } from "../../../lib/utils";
import type { Document } from "../types/document";
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument } from "../hooks/useDocuments";
import { DocumentForm } from "../components/DocumentForm";
import { toast } from "sonner";

export function DocumentsPage() {
    const { setHeader, resetHeader } = useHeader();
    const { data: documents, isLoading, isError } = useDocuments();
    const createDocument = useCreateDocument();
    const updateDocument = useUpdateDocument();
    const deleteDocument = useDeleteDocument();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [docToDelete, setDocToDelete] = useState<Document | null>(null);

    useEffect(() => {
        setHeader({
            title: "Gestão de Documentos",
            search: {
                value: searchTerm,
                onChange: setSearchTerm,
                placeholder: "Buscar por nome, tipo ou OCR..."
            },
            actions: (
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]"
                >
                    <Plus className="w-4 h-4" />
                    Upload Documento
                </button>
            ),
        });
        return () => resetHeader();
    }, [setHeader, resetHeader, searchTerm]);


    const handleCreate = () => {
        setEditingDocument(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (doc: Document) => {
        setEditingDocument(doc);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!docToDelete) return;
        try {
            await deleteDocument.mutateAsync(docToDelete.id);
            setDocToDelete(null);
            toast.success("Documento excluído com sucesso!");
        } catch {
            toast.error("Erro ao excluir documento.");
        }
    };

    const handleSubmit = async (data: Omit<Document, 'id'>) => {
        try {
            if (editingDocument) {
                await updateDocument.mutateAsync({ ...data, id: editingDocument.id });
                toast.success("Documento atualizado!");
            } else {
                await createDocument.mutateAsync(data);
                toast.success("Documento criado!");
            }
            setIsModalOpen(false);
        } catch {
            toast.error("Erro ao salvar documento.");
        }
    };

    const filteredDocuments = documents?.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.ocrData && JSON.stringify(doc.ocrData).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 w-full">

            <div className="w-full">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
                    <div className="col-span-5 md:col-span-4">Documento</div>
                    <div className="col-span-4 md:col-span-3">Status / Tipo</div>
                    <div className="col-span-3 md:col-span-2 text-center">Origem</div>
                    <div className="hidden md:block md:col-span-2 text-center">Data</div>
                    <div className="col-span-1 text-right">Ações</div>
                </div>

                <div className="space-y-1">
                    {isError ? (
                        <div className="col-span-full p-8 text-center text-red-500">Erro ao carregar documentos.</div>
                    ) : filteredDocuments?.map((doc: Document) => (
                        <div key={doc.id} className="group grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-2xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5">
                            <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center border border-white/5 text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-sm text-white truncate">{doc.name}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono opacity-50 uppercase tracking-widest truncate">{((doc.upload?.size || 0) / 1024 / 1024).toFixed(2)} MB • {doc.upload?.mimetype.split('/')[1]?.toUpperCase()}</div>
                                </div>
                            </div>

                            <div className="col-span-4 md:col-span-3 space-y-0.5">
                                <div className="flex flex-wrap gap-1">
                                    <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border",
                                        doc.status === 'PROCESSED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            doc.status === 'ERROR' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    )}>
                                        {doc.status}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground text-[9px] font-black tracking-widest uppercase border border-white/10">
                                        {doc.type}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-3 md:col-span-2 flex justify-center text-center">
                                {doc.employeeId ? (
                                    <span className="text-[10px] text-muted-foreground font-medium bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                        EMP #{doc.employeeId.slice(0, 6)}
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground/30 font-medium">System</span>
                                )}
                            </div>

                            <div className="hidden md:block md:col-span-2 text-center">
                                <span className="text-xs text-muted-foreground/60 font-medium">
                                    {new Date(doc.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="col-span-12 md:col-span-1 flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                {doc.upload?.url && (
                                    <a
                                        href={doc.upload.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                                        aria-label="Baixar documento"
                                        title="Baixar documento"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() => handleEdit(doc)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                                    aria-label="Editar documento"
                                    title="Editar documento"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDocToDelete(doc)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                    aria-label="Excluir documento"
                                    title="Excluir documento"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {!isLoading && filteredDocuments?.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted-foreground/30">
                                <Search className="w-8 h-8" />
                            </div>
                            <p className="text-muted-foreground text-sm">Nenhum documento encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <DocumentForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    initialData={editingDocument}
                    isLoading={createDocument.isPending || updateDocument.isPending}
                />
            )}

            {/* Modal de confirmação de exclusão */}
            {docToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="glass w-full max-w-sm p-6 rounded-[2rem] border border-red-500/20 shadow-2xl space-y-6">
                        <div className="space-y-2 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold">Excluir Documento?</h3>
                            <p className="text-xs text-muted-foreground">
                                Você está prestes a remover <b>{docToDelete.name}</b>. Esta ação é irreversível.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDocToDelete(null)}
                                className="py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="py-3 rounded-xl bg-red-500 hover:bg-red-600 text-black text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-500/20"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
