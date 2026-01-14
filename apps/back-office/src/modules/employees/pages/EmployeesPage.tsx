import { useState, useEffect } from "react";
import { UserPlus, User as UserIcon, Trash2, Search, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useEmployees, useDeleteEmployee } from "../hooks/useEmployees";
import { useHeader } from "../../../components/layout/HeaderContext";
import type { Employee } from "../types/employee";
import { toast } from "sonner";
import { cn } from "../../../lib/utils";

export function EmployeesPage() {
    const { setHeader, resetHeader } = useHeader();
    const { data: employees, isLoading } = useEmployees();
    const deleteEmployee = useDeleteEmployee();

    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setHeader({
            title: "Gestão de Funcionários",
            search: {
                value: searchTerm,
                onChange: setSearchTerm,
                placeholder: "Buscar por nome, CPF ou matrícula..."
            },
            actions: (
                <Link
                    to="/funcionarios/novo"
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-xs uppercase tracking-widest shadow-[0_0_20px_-5px_rgba(var(--primary-rgb),0.5)]"
                >
                    <UserPlus className="w-4 h-4" />
                    Novo Funcionário
                </Link>
            ),
        });
        return () => resetHeader();
    }, [setHeader, resetHeader, searchTerm]);



    const handleDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await deleteEmployee.mutateAsync(employeeToDelete.id);
            setEmployeeToDelete(null);
            toast.success("Funcionário excluído com sucesso!");
        } catch {
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


            {/* Listagem Minimalista */}
            <div className="w-full">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">
                    <div className="col-span-5 md:col-span-4">Funcionário</div>
                    <div className="col-span-4 md:col-span-3">Identificação</div>
                    <div className="col-span-3 md:col-span-2 text-center">Status</div>
                    <div className="hidden md:block md:col-span-2 text-center">Data</div>
                    <div className="col-span-1 text-right">Ações</div>
                </div>

                <div className="space-y-1">
                    {filteredEmployees?.map((emp) => (
                        <div
                            key={emp.id}
                            className="group grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-2xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5"
                        >
                            <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center border border-white/5 text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-sm text-white truncate">{emp.name}</div>
                                    <div className="text-[10px] text-muted-foreground font-mono opacity-50">#{emp.id.slice(0, 8)}</div>
                                </div>
                            </div>

                            <div className="col-span-4 md:col-span-3 space-y-0.5">
                                <div className="text-xs text-muted-foreground font-medium">{emp.cpf}</div>
                                <div className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-wider">{emp.registration ? `MAT: ${emp.registration}` : 'S/ MATRÍCULA'}</div>
                            </div>

                            <div className="col-span-3 md:col-span-2 flex justify-center">
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border",
                                    emp.status === 'ACTIVE'
                                        ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20"
                                        : "bg-red-500/5 text-red-500 border-red-500/20"
                                )}>
                                    {emp.status === 'ACTIVE' ? "Ativo" : "Inativo"}
                                </span>
                            </div>

                            <div className="hidden md:block md:col-span-2 text-center">
                                <span className="text-xs text-muted-foreground/60 font-medium">
                                    {new Date(emp.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="col-span-12 md:col-span-1 flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <Link
                                    to={`/funcionarios/${emp.id}`}
                                    className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                                    aria-label="Ver detalhes do funcionário"
                                    title="Ver detalhes"
                                >
                                    <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEmployeeToDelete(emp);
                                    }}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                    aria-label="Excluir funcionário"
                                    title="Excluir"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredEmployees?.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-muted-foreground/30">
                                <Search className="w-8 h-8" />
                            </div>
                            <p className="text-muted-foreground text-sm">Nenhum funcionário encontrado.</p>
                        </div>
                    )}
                </div>
            </div>


            {/* Modal de confirmação */}
            {employeeToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="glass w-full max-w-sm p-6 rounded-[2rem] border border-red-500/20 shadow-2xl space-y-6">
                        <div className="space-y-2 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold">Excluir Registro?</h3>
                            <p className="text-xs text-muted-foreground">
                                Você está prestes a remover <b>{employeeToDelete.name}</b>. Esta ação é irreversível.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setEmployeeToDelete(null)}
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
    );
}
