import { useState, useEffect } from "react";
import { UserPlus, User as UserIcon, Shield, Calendar, MoreHorizontal, Check, X, Loader2, Trash2, Key } from "lucide-react";
import { useUsers, useCreateUser, useDeleteUser } from "../hooks/useUsers";
import { useHeader } from "../../../components/layout/HeaderContext";
import type { User } from "../types/user";
import { toast } from "sonner";

export function UsersPage() {
    const { setHeader, resetHeader } = useHeader();
    const { data: users, isLoading } = useUsers();
    const createUser = useCreateUser();
    const deleteUser = useDeleteUser();

    const [isAddingUser, setIsAddingUser] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [deleteCode, setDeleteCode] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "VIEWER" as User["role"],
    });

    useEffect(() => {
        setHeader({
            title: "Gestão de Usuários",
            actions: (
                <button
                    onClick={() => setIsAddingUser(true)}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Novo Usuário
                </button>
            ),
        });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser.mutateAsync(formData);
            setIsAddingUser(false);
            setFormData({ name: "", email: "", password: "", role: "VIEWER" });
            toast.success("Usuário criado com sucesso!");
        } catch (error) {
            console.error("Failed to create user:", error);
            toast.error("Erro ao criar usuário.");
        }
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userToDelete) return;

        try {
            await deleteUser.mutateAsync({ id: userToDelete.id, deleteCode });
            setUserToDelete(null);
            setDeleteCode("");
            toast.success("Usuário excluído com sucesso!");
        } catch (error) {
            console.error("Failed to delete user:", error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error((error as any).response?.data?.message || "Erro ao excluir usuário.");
        }
    };

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Modal de Adição */}
            {isAddingUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-lg p-8 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold">Adicionar Usuário</h2>
                            <button onClick={() => setIsAddingUser(false)} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="Nome do usuário"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">E-mail</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="ex@exemplo.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Senha Temporária</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Cargo / Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as User["role"] })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none"
                                    >
                                        <option value="VIEWER" className="bg-[#020617]">VIEWER (Apenas visualização)</option>
                                        <option value="USER" className="bg-[#020617]">USER (Usuário operacional)</option>
                                        <option value="ADMIN" className="bg-[#020617]">ADMIN (Controle total)</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={createUser.isPending}
                                className="w-full bg-primary text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-xl shadow-primary/20"
                            >
                                {createUser.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Criar Conta
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Exclusão */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass w-full max-w-md p-8 rounded-3xl border border-red-500/20 shadow-2xl">
                        <div className="flex items-center gap-3 text-red-500 mb-4">
                            <div className="p-2 rounded-xl bg-red-500/10">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold">Excluir Usuário</h2>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            Você está prestes a excluir a conta de <span className="text-white font-bold">{userToDelete.name}</span> ({userToDelete.email}).
                            Esta ação é irreversível e removerá todos os dados associados.
                        </p>

                        <form onSubmit={handleDelete} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Key className="w-3.5 h-3.5" />
                                    Código Mestre de Exclusão
                                </label>
                                <input
                                    type="password"
                                    required
                                    autoFocus
                                    value={deleteCode}
                                    onChange={(e) => setDeleteCode(e.target.value)}
                                    className="w-full bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/50 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUserToDelete(null);
                                        setDeleteCode("");
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 font-bold text-sm hover:bg-white/5 transition-all text-muted-foreground"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteUser.isPending}
                                    className="flex-[1.5] bg-red-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {deleteUser.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Confirmar Exclusão
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Listagem */}
            <div className="glass rounded-3xl border border-white/5 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Usuário</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cargo</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Membro desde</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users?.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.01] transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{user.name || "Sem nome"}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                            <div className="text-[10px] text-muted-foreground/50 font-mono mt-1 select-all hover:text-white transition-colors cursor-copy" title="Clique para copiar o ID">
                                                ID: {user.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">{user.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.status === 'ACTIVE' ? (
                                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                            Ativo
                                        </span>
                                    ) : user.status === 'PENDING' ? (
                                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                            Pendente
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                                            Inativo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setUserToDelete(user)}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-muted-foreground"
                                            title="Excluir usuário"
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
        </div>
    );
}
