import { useState, useEffect } from "react";
import { X, Check, Loader2 } from "lucide-react";
import type { Contract } from "../types/employee";
import { useCreateContract, useUpdateContract } from "../hooks/useContracts";
import { toast } from "sonner";

interface ContractFormProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Contract | null;
    employeeId?: string;
    onSuccess?: () => void;
}

export function ContractForm({ isOpen, onClose, initialData, employeeId, onSuccess }: ContractFormProps) {
    const createContract = useCreateContract();
    const updateContract = useUpdateContract();

    const [formData, setFormData] = useState<Partial<Contract>>({
        type: "CLT",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type,
                startDate: new Date(initialData.startDate).toISOString().split('T')[0],
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
                status: initialData.status,
            });
        } else {
            setFormData({
                type: "CLT",
                startDate: new Date().toISOString().split('T')[0],
                endDate: "",
                status: "ACTIVE",
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                employeeId: employeeId || initialData?.employeeId,
                startDate: new Date(formData.startDate!).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            };

            if (initialData) {
                await updateContract.mutateAsync({ id: initialData.id, ...payload } as any);
                toast.success("Contrato atualizado com sucesso!");
            } else {
                await createContract.mutateAsync(payload as any);
                toast.success("Contrato criado com sucesso!");
            }
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Erro ao salvar contrato.");
        }
    };

    const isLoading = createContract.isPending || updateContract.isPending;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">{initialData ? "Editar Contrato" : "Novo Contrato"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Tipo de Contrato</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            >
                                <option value="CLT">CLT</option>
                                <option value="PJ">PJ / Prestador</option>
                                <option value="ESTAGIO">Estágio</option>
                                <option value="TEMPORARIO">Temporário</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Data de Início</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Data de Término (Opcional)</label>
                            <input
                                type="date"
                                value={formData.endDate || ""}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            >
                                <option value="ACTIVE">ATIVO</option>
                                <option value="INACTIVE">INATIVO</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-xl shadow-primary/20"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        {initialData ? "Atualizar Contrato" : "Salvar Contrato"}
                    </button>
                </form>
            </div>
        </div>
    );
}
