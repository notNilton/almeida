import { useState } from "react";
import { Plus, FileText, Download, Trash2, Pencil } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Document } from "../types/document";
import { useDocuments, useCreateDocument, useUpdateDocument, useDeleteDocument } from "../hooks/useDocuments";
import { DocumentForm } from "../components/DocumentForm";

export function DocumentsPage() {
    const { data: documents, isLoading, isError } = useDocuments();
    const createDocument = useCreateDocument();
    const updateDocument = useUpdateDocument();
    const deleteDocument = useDeleteDocument();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<Document | undefined>(undefined);

    const handleCreate = () => {
        setEditingDocument(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (doc: Document) => {
        setEditingDocument(doc);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja remover este documento?')) {
            await deleteDocument.mutateAsync(id);
        }
    };

    const handleSubmit = async (data: Omit<Document, 'id'>) => {
        if (editingDocument) {
            await updateDocument.mutateAsync({ ...data, id: editingDocument.id });
        } else {
            await createDocument.mutateAsync(data);
        }
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
                    <p className="text-muted-foreground mt-1">Gerencie os documentos oficiais e transparência.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Upload Documento
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {isError ? (
                    <div className="col-span-full p-8 text-center text-red-500">Erro ao carregar documentos.</div>
                ) : (
                    documents?.map((doc: Document) => (
                        <div key={doc.id} className="glass p-5 rounded-2xl border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{doc.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
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
                                            {doc.employeeId && (
                                                <span className="text-[10px] text-primary font-bold">
                                                    Emp: #{doc.employeeId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {doc.upload?.url && (
                                        <a href={doc.upload.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors" title="Download">
                                            <Download className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleEdit(doc)}
                                        className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="p-2 hover:bg-white/5 rounded-lg text-red-400/50 hover:text-red-400 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {doc.ocrData && (
                                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Dados Extraídos (OCR)</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(doc.ocrData).slice(0, 4).map(([key, value]) => (
                                            <div key={key} className="text-[11px]">
                                                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                                                <span className="text-white ml-1 font-medium">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                {!isLoading && documents?.length === 0 && (
                    <div className="col-span-full p-8 text-center text-muted-foreground">Nenhum documento encontrado.</div>
                )}
            </div>

            <DocumentForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingDocument}
                isLoading={createDocument.isPending || updateDocument.isPending}
            />
        </div>
    );
}
