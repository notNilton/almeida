import { useState, useEffect } from "react";
import { FilePlus, FileSignature, Calendar, Check, X, Loader2, Trash2, Search, User } from "lucide-react";
import { useContracts, useCreateContract, useDeleteContract } from "../hooks/useContracts";
import { useHeader } from "../../../components/layout/HeaderContext";
import type { Contract } from "../types/employee";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

export function ContractsPage() {
    const { setHeader, resetHeader } = useHeader();
    const { data: contracts, isLoading } = useContracts();
    const createContract = useCreateContract();
    const deleteContract = useDeleteContract();

    const [isAdding, setIsAdding] = useState(false);
    const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        employeeId: "",
        type: "CLT",
        startDate: "",
        endDate: "",
        status: "ACTIVE",
    });

    useEffect(() => {
        setHeader({
            title: "Gestão de Contratos",
            search: {
                value: searchTerm,
                onChange: setSearchTerm,
                placeholder: "Buscar por tipo ou ID do funcionário..."
            },
            actions: (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]"
                >
                    <FilePlus className="w-4 h-4" />
                    Novo Contrato
                </button>
            ),
        });
        return () => resetHeader();
    }, [setHeader, resetHeader, searchTerm]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createContract.mutateAsync({
                ...formData,
                employeeId: formData.employeeId,
            });
            setIsAdding(false);
            setFormData({ employeeId: "", type: "CLT", startDate: "", endDate: "", status: "ACTIVE" });
            toast.success("Contrato criado com sucesso!");
        } catch {
            toast.error("Erro ao criar contrato.");
        }
    };

    const handleDelete = async () => {
        if (!contractToDelete) return;
        try {
            await deleteContract.mutateAsync(contractToDelete.id);
            setContractToDelete(null);
            toast.success("Contrato excluído com sucesso!");
        } catch {
            toast.error("Erro ao excluir contrato.");
        }
    };

    const filteredContracts = contracts?.filter(c =>
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.employeeId.includes(searchTerm)
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

            {/* Modal de Adição */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="glass w-full max-w-lg p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold">Novo Contrato</h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Preencha os dados abaixo</p>
                            </div>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] pl-1">ID do Funcionário</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/[0.05] focus:border-primary/30 transition-all font-medium placeholder:text-muted-foreground/20"
                                        placeholder="Ex: nanoid_123"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] pl-1">Tipo</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/[0.05] focus:border-primary/30 transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="CLT" className="bg-[#020617]">CLT</option>
                                            <option value="PJ" className="bg-[#020617]">PJ</option>
                                            <option value="FREELANCE" className="bg-[#020617]">Freelance</option>
                                            <option value="ESTAGIO" className="bg-[#020617]">Estágio</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] pl-1">Status</label>
                                    <div className="relative">
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/[0.05] focus:border-primary/30 transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="ACTIVE" className="bg-[#020617]">Ativo</option>
                                            <option value="SUSPENDED" className="bg-[#020617]">Suspenso</option>
                                            <option value="TERMINATED" className="bg-[#020617]">Rescindido</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] pl-1">Início</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/[0.05] focus:border-primary/30 transition-all font-medium placeholder:text-muted-foreground/20 text-white scheme-dark"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] pl-1">Término</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/[0.05] focus:border-primary/30 transition-all font-medium placeholder:text-muted-foreground/20 text-white scheme-dark"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={createContract.isPending}
                                className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {createContract.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Criar Contrato
                            </button>
                        </form>


                        {/* Listagem Minimalista */}
                        <div className="w-full">
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
                                <div className="col-span-5 md:col-span-4">Funcionário / Tipo</div>
                                <div className="col-span-4 md:col-span-3">Período</div>
                                <div className="col-span-3 md:col-span-2 text-center">Status</div>
                                <div className="hidden md:block md:col-span-2 text-center">Atualização</div>
                                <div className="col-span-1 text-right">Ações</div>
                            </div>

                            <div className="space-y-1">
                                {filteredContracts?.map((contract) => (
                                    <div key={contract.id} className="group grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-2xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5">
                                        <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center border border-white/5 text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm text-white truncate">#{contract.employeeId?.slice(0, 8)}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono opacity-50 uppercase tracking-widest">{contract.type}</div>
                                            </div>
                                        </div>

                                        <div className="col-span-4 md:col-span-3 space-y-0.5">
                                            <div className="flex items-center gap-2 text-xs text-white font-medium">
                                                <span>{new Date(contract.startDate).toLocaleDateString()}</span>
                                                <span className="text-muted-foreground">→</span>
                                            </div>
                                            <div className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-wider">
                                                {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Presente"}
                                            </div>
                                        </div>

                                        <div className="col-span-3 md:col-span-2 flex justify-center">
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border",
                                                contract.status === 'ACTIVE'
                                                    ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                                                    : contract.status === 'TERMINATED'
                                                        ? "bg-red-500/5 text-red-500 border-red-500/20"
                                                        : "bg-amber-500/5 text-amber-500 border-amber-500/20"
                                            )}>
                                                {contract.status === 'ACTIVE' ? 'Ativo' : contract.status === 'TERMINATED' ? 'Encerrado' : 'Suspenso'}
                                            </span>
                                        </div>

                                        <div className="hidden md:block md:col-span-2 text-center">
                                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 font-medium">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(contract.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="col-span-12 md:col-span-1 flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                                                <FileSignature className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setContractToDelete(contract);
                                                }}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {filteredContracts?.length === 0 && (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted-foreground/30">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <p className="text-muted-foreground text-sm">Nenhum contrato encontrado.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal de confirmação de exclusão */}
                        {contractToDelete && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                                <div className="glass w-full max-w-sm p-6 rounded-[2rem] border border-red-500/20 shadow-2xl space-y-6">
                                    <div className="space-y-2 text-center">
                                        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                                            <Trash2 className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold">Excluir Contrato?</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Você está prestes a remover o contrato do funcionário <b>#{contractToDelete.employeeId?.slice(0, 8)}</b>.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setContractToDelete(null)}
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
                </div>
            )}
        </div>
    );
}

