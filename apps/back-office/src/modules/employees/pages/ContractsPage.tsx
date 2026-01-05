import { useState, useEffect } from "react";
import { FilePlus, FileSignature, Calendar, MoreHorizontal, Check, X, Loader2, Trash2, Search, User } from "lucide-react";
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
            actions: (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-sm"
                >
                    <FilePlus className="w-4 h-4" />
                    Novo Contrato
                </button>
            ),
        });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

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
        } catch (error) {
            toast.error("Erro ao criar contrato.");
        }
    };

    const handleDelete = async () => {
        if (!contractToDelete) return;
        try {
            await deleteContract.mutateAsync(contractToDelete.id);
            setContractToDelete(null);
            toast.success("Contrato excluído com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir contrato.");
        }
    };

    const filteredContracts = contracts?.filter(c =>
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.employeeId.includes(searchTerm)
    );

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Buscar por tipo ou ID do funcionário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                />
            </div>

            {/* Modal de Adição */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Novo Contrato</h2>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">ID do Funcionário</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="Ex: nanoid_123"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Tipo de Contrato</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none"
                                    >
                                        <option value="CLT" className="bg-[#020617]">CLT</option>
                                        <option value="PJ" className="bg-[#020617]">PJ</option>
                                        <option value="FREELANCE" className="bg-[#020617]">Freelance</option>
                                        <option value="ESTAGIO" className="bg-[#020617]">Estágio</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none"
                                    >
                                        <option value="ACTIVE" className="bg-[#020617]">Ativo</option>
                                        <option value="SUSPENDED" className="bg-[#020617]">Suspenso</option>
                                        <option value="TERMINATED" className="bg-[#020617]">Rescindido</option>
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
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Data de Término</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={createContract.isPending}
                                className="w-full bg-primary text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-xl shadow-primary/20"
                            >
                                {createContract.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Criar Contrato
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Listagem */}
            <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Funcionário ID</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo / Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Período</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Última Atualização</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredContracts?.map((contract) => (
                            <tr key={contract.id} className="hover:bg-white/[0.01] transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground border border-white/10">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="font-bold text-sm text-white">#{contract.employeeId}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-bold text-white">{contract.type}</div>
                                        <div className="flex">
                                            <span className={cn(
                                                "text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded border uppercase",
                                                contract.status === 'ACTIVE'
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    : contract.status === 'TERMINATED'
                                                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            )}>
                                                {contract.status}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-white">
                                        <span>{new Date(contract.startDate).toLocaleDateString()}</span>
                                        <span className="text-muted-foreground">→</span>
                                        <span className="text-muted-foreground">
                                            {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Presente"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(contract.updatedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-muted-foreground hover:text-white">
                                            <FileSignature className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setContractToDelete(contract)}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-muted-foreground"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-muted-foreground hover:text-white">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmação de exclusão */}
            {contractToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-sm p-6 rounded-2xl border border-red-500/20">
                        <h3 className="text-lg font-bold mb-2">Excluir Contrato</h3>
                        <p className="text-sm text-muted-foreground mb-6">Deseja realmente excluir este contrato? Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-2">
                            <button onClick={() => setContractToDelete(null)} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-bold">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
