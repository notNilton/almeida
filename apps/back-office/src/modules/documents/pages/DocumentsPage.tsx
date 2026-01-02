import { useState } from "react";
import { Plus, FileText, Download, Trash2, Shield, Pencil } from "lucide-react";
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

    const handleDelete = async (id: number) => {
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
                        <div key={doc.id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium">{doc.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> {doc.isPublic ? 'Público' : 'Privado'}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">
                                            {doc.category}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase">
                                            {doc.upload?.mimetype.split('/').pop()?.toUpperCase() || 'FILE'} • {doc.upload ? (doc.upload.size / 1024 / 1024).toFixed(2) : 0} MB
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {doc.upload?.url && (
                                    <a href={doc.upload.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-colors">
                                        <Download className="w-5 h-5" />
                                    </a>
                                )}
                                <button
                                    onClick={() => handleEdit(doc)}
                                    className="p-2 hover:bg-white/5 rounded text-muted-foreground hover:text-white transition-colors"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 hover:bg-white/5 rounded text-red-400/50 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
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
