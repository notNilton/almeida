import { useState } from "react";
import { Plus, Clock, Pencil, Trash2 } from "lucide-react";
import type { HistoryEvent } from "../types/history";
import { useHistory, useCreateHistoryEvent, useUpdateHistoryEvent, useDeleteHistoryEvent } from "../hooks/useHistory";
import { HistoryForm } from "../components/HistoryForm";

export function HistoryPage() {
    const { data: history, isLoading, isError } = useHistory();
    const createEvent = useCreateHistoryEvent();
    const updateEvent = useUpdateHistoryEvent();
    const deleteEvent = useDeleteHistoryEvent();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<HistoryEvent | undefined>(undefined);

    const handleCreate = () => {
        setEditingEvent(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (event: HistoryEvent) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja remover este evento?')) {
            await deleteEvent.mutateAsync(id);
        }
    };

    const handleSubmit = async (data: Omit<HistoryEvent, 'id'>) => {
        if (editingEvent) {
            await updateEvent.mutateAsync({ ...data, id: editingEvent.id });
        } else {
            await createEvent.mutateAsync(data);
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
                    <h1 className="text-3xl font-bold tracking-tight">História</h1>
                    <p className="text-muted-foreground mt-1">Timeline de eventos e marcos da instituição.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Novo Evento
                </button>
            </div>

            <div className="space-y-4 mt-8">
                {isError ? (
                    <div className="p-8 text-center text-red-500">Erro ao carregar história.</div>
                ) : (
                    history?.map((item: HistoryEvent) => (
                        <div key={item.id} className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-bold text-primary">{item.year}</span>
                                    <div className="w-px h-8 bg-white/10 my-1" />
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-2 py-0.5 rounded border border-white/5">
                                        {item.type}
                                    </span>
                                    <h3 className="text-lg font-medium mt-1">{item.event}</h3>
                                    {item.image && (
                                        <div className="mt-4 w-48 h-24 rounded-lg overflow-hidden border border-white/5 shadow-inner bg-white/5">
                                            <img src={item.image.url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 hover:bg-white/5 rounded text-muted-foreground hover:text-white"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 hover:bg-white/5 rounded text-red-400/50 hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {!isLoading && history?.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">Nenhum evento encontrado.</div>
                )}
            </div>

            <HistoryForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingEvent}
                isLoading={createEvent.isPending || updateEvent.isPending}
            />
        </div>
    );
}
