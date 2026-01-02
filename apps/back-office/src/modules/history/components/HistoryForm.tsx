import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import type { HistoryEvent } from '../types/history';
import api from '../../../lib/api';

interface HistoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<HistoryEvent, 'id'>) => Promise<void>;
    initialData?: HistoryEvent;
    isLoading?: boolean;
}

export function HistoryForm({ isOpen, onClose, onSubmit, initialData, isLoading }: HistoryFormProps) {
    const [formData, setFormData] = useState<Omit<HistoryEvent, 'id'>>({
        year: new Date().getFullYear().toString(),
        event: '',
        type: 'Marco',
        imageId: undefined,
        image: undefined,
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                year: initialData.year,
                event: initialData.event,
                type: initialData.type,
                imageId: initialData.imageId,
                image: initialData.image,
                date: initialData.date || '',
            });
        } else {
            setFormData({
                year: new Date().getFullYear().toString(),
                event: '',
                type: 'Marco',
                imageId: undefined,
                image: undefined,
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

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
                console.error('Error uploading history image:', error);
                alert('Erro ao carregar imagem.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { image, ...payload } = formData;
        await onSubmit(payload as Omit<HistoryEvent, 'id'>);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold">{initialData ? 'Editar Evento' : 'Novo Evento'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Imagem do Evento (Opcional)</label>
                        <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white/5 border border-white/10 group">
                            {formData.image ? (
                                <img src={formData.image.url} alt="Event" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload className="w-5 h-5 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Ano</label>
                            <input
                                type="text"
                                required
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="Marco">Marco</option>
                                <option value="Prêmio">Prêmio</option>
                                <option value="Expansão">Expansão</option>
                                <option value="Parceria">Parceria</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Evento</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.event}
                            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Data Completa (Opcional)</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
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
