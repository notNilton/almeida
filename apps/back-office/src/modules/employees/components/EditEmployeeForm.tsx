import { useState, useId } from "react";
import { X, Check, Loader2, Pencil } from "lucide-react";
import { useUpdateEmployee } from "../hooks/useEmployees";
import { toast } from "sonner";
import type { Employee } from "../types/employee";

interface EditEmployeeFormProps {
    isOpen: boolean;
    onClose: () => void;
    employee: Employee;
}

export function EditEmployeeForm({ isOpen, onClose, employee }: EditEmployeeFormProps) {
    const updateEmployeeMutation = useUpdateEmployee();
    const nameId = useId();
    const cpfId = useId();
    const registrationId = useId();
    const statusId = useId();
    const titleId = useId();

    const [formData, setFormData] = useState({
        name: employee.name,
        cpf: employee.cpf,
        registration: employee.registration || "",
        status: employee.status
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateEmployeeMutation.mutateAsync({
                id: employee.id,
                ...formData
            });
            toast.success("Funcionário atualizado com sucesso!");
            onClose();
        } catch {
            toast.error("Erro ao atualizar funcionário.");
        }
    };

    if (!isOpen) return null;

    return (
        <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="glass w-full max-w-lg p-8 rounded-[2rem] border border-white/10 shadow-2xl relative">
                <div className="flex items-center justify-between mb-8">
                    <h2 id={titleId} className="text-xl font-bold flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-primary" />
                        Editar Informações
                    </h2>
                    <button aria-label="Fechar modal" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor={nameId} className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Nome Completo</label>
                            <input
                                id={nameId}
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor={cpfId} className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">CPF</label>
                            <input
                                id={cpfId}
                                type="text"
                                required
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor={registrationId} className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Matrícula</label>
                                <input
                                    id={registrationId}
                                    type="text"
                                    value={formData.registration}
                                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor={statusId} className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Status</label>
                                <select
                                    id={statusId}
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none"
                                >
                                    <option value="ACTIVE" className="bg-black">Ativo</option>
                                    <option value="INACTIVE" className="bg-black">Inativo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={updateEmployeeMutation.isPending}
                        className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        {updateEmployeeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    );
}
