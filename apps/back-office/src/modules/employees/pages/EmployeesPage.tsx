import { useState, useEffect } from "react";
import { UserPlus, User as UserIcon, Calendar, MoreHorizontal, Check, X, Loader2, Trash2, FileSignature, Search } from "lucide-react";
import { useEmployees, useCreateEmployee, useDeleteEmployee } from "../hooks/useEmployees";
import { useHeader } from "../../../components/layout/HeaderContext";
import type { Employee } from "../types/employee";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

export function EmployeesPage() {
    const { setHeader, resetHeader } = useHeader();
    const { data: employees, isLoading } = useEmployees();
    const createEmployee = useCreateEmployee();
    const deleteEmployee = useDeleteEmployee();

    const [isAdding, setIsAdding] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        cpf: "",
        registration: "",
        status: "ACTIVE" as Employee["status"],
    });

    useEffect(() => {
        setHeader({
            title: "Gestão de Funcionários",
            actions: (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Novo Funcionário
                </button>
            ),
        });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createEmployee.mutateAsync(formData);
            setIsAdding(false);
            setFormData({ name: "", cpf: "", registration: "", status: "ACTIVE" });
            toast.success("Funcionário cadastrado com sucesso!");
        } catch (error) {
            toast.error("Erro ao cadastrar funcionário.");
        }
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await deleteEmployee.mutateAsync(employeeToDelete.id);
            setEmployeeToDelete(null);
            toast.success("Funcionário excluído com sucesso!");
        } catch (error) {
            toast.error("Erro ao excluir funcionário.");
        }
    };

    const filteredEmployees = employees?.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.cpf.includes(searchTerm) ||
        emp.registration?.includes(searchTerm)
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
                    placeholder="Buscar por nome, CPF ou matrícula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                />
            </div>

            {/* Modal de Adição (Simples) */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Novo Funcionário</h2>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="Nome"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">CPF</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Matrícula</label>
                                    <input
                                        type="text"
                                        value={formData.registration}
                                        onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="Opcional"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={createEmployee.isPending}
                                className="w-full bg-primary text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-xl shadow-primary/20"
                            >
                                {createEmployee.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Salvar Funcionário
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
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Funcionário</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">CPF / Matrícula</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cadastrado em</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredEmployees?.map((emp) => (
                            <tr key={emp.id} className="hover:bg-white/[0.01] transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{emp.name}</div>
                                            <div className="text-xs text-muted-foreground">ID: #{emp.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="text-sm text-white">{emp.cpf}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{emp.registration || "N/A"}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold border",
                                        emp.status === 'ACTIVE'
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            : "bg-red-500/10 text-red-500 border-red-500/20"
                                    )}>
                                        {emp.status === 'ACTIVE' ? "ATIVO" : "INATIVO"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(emp.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-muted-foreground hover:text-white" title="Contratos">
                                            <FileSignature className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setEmployeeToDelete(emp)}
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

            {/* Modal de confirmação de exclusão simplificado */}
            {employeeToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-sm p-6 rounded-2xl border border-red-500/20">
                        <h3 className="text-lg font-bold mb-2">Excluir Funcionário</h3>
                        <p className="text-sm text-muted-foreground mb-6">Deseja realmente excluir <b>{employeeToDelete.name}</b>? Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-2">
                            <button onClick={() => setEmployeeToDelete(null)} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-bold">Cancelar</button>
                            <button onClick={handleDelete} className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-bold">Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
