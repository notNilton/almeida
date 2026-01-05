import { useState, useEffect } from 'react';
import { X, Upload, File as FileIcon } from 'lucide-react';
import type { Document } from '../types/document';
import api from '../../../lib/api';
import { cn } from '../../../lib/utils';

interface DocumentFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Document, 'id'>) => Promise<void>;
    initialData?: Document;
    isLoading?: boolean;
}

export function DocumentForm({ isOpen, onClose, onSubmit, initialData, isLoading }: DocumentFormProps) {
    const [formData, setFormData] = useState<Omit<Document, 'id' | 'status' | 'ocrData' | 'createdAt' | 'updatedAt'>>({
        name: '',
        type: 'OTHER',
        uploadId: undefined,
        upload: undefined,
        employeeId: undefined,
    });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                type: initialData.type || 'OTHER',
                uploadId: initialData.uploadId,
                upload: initialData.upload,
                employeeId: initialData.employeeId,
            });
        } else {
            setFormData({
                name: '',
                type: 'OTHER',
                uploadId: undefined,
                upload: undefined,
                employeeId: undefined,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validateFile = (file: File) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('Tipo de arquivo não permitido. Use PDF, Word, Excel ou Imagens.');
            return false;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('Arquivo muito grande. Limite de 10MB.');
            return false;
        }

        return true;
    };

    const processFile = async (file: File) => {
        if (!validateFile(file)) return;

        try {
            const form = new FormData();
            form.append('file', file);
            const res = await api.post('/uploads', form);
            const uploadData = res.data;
            setFormData(prev => ({
                ...prev,
                uploadId: uploadData.id,
                upload: uploadData,
                name: prev.name || uploadData.originalName
            }));
        } catch (error: any) {
            console.error('Error uploading document file:', error);
            alert('Erro ao carregar arquivo.');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await processFile(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await processFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { upload, ...payload } = formData;
        if (!payload.uploadId) {
            alert('Por favor, faça o upload de um arquivo primeiro.');
            return;
        }
        await onSubmit(payload as any);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold">{initialData ? 'Editar Documento' : 'Novo Documento'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Arquivo</label>
                            <div
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={cn(
                                    "relative border-2 border-dashed rounded-xl p-8 transition-colors group",
                                    isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:bg-white/5"
                                )}
                            >
                                {formData.upload ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            <FileIcon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{formData.upload.originalName}</p>
                                            <p className="text-xs text-muted-foreground">{(formData.upload.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <label className="text-xs font-bold text-primary hover:underline cursor-pointer">
                                            Alterar
                                            <input type="file" className="hidden" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                                        <Upload className={cn(
                                            "w-8 h-8 transition-colors",
                                            isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                        )} />
                                        <span className="text-sm text-muted-foreground text-center">
                                            {isDragging ? 'Solte para fazer upload' : 'Clique ou arraste para fazer upload do documento'}
                                        </span>
                                        <input type="file" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {formData.upload && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Nome para Exibição</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Ex: Edital de Convocação 2024"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">ID do Funcionário (Opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.employeeId || ''}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value || undefined })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="Ex: ABC123XYZ"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Tipo de Documento</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="PAYSLIP">Folha de Pagamento</option>
                                        <option value="ACCOUNT_OPENING">Abertura de Conta</option>
                                        <option value="TRANSPORT_VOUCHER">Vale Transporte</option>
                                        <option value="PRESENTATION_LETTER">Carta de Apresentação</option>
                                        <option value="SUBSTITUTION_FORM">Formulário de Substituição</option>
                                        <option value="CLOSING_COMMUNICATION">Comunicação de Fechamento</option>
                                        <option value="OTHER">Outros</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
