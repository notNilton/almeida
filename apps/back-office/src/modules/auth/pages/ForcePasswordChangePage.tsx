import { useState } from "react";
import { Lock, Key, Check, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../../../lib/api";
import { toast } from "sonner";

export function ForcePasswordChangePage() {
    const { logout, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/change-password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            toast.success("Senha alterada com sucesso! Faça login novamente com sua nova senha.");
            setTimeout(() => logout(), 2000);
        } catch (error: any) {
            console.error("Password change failed:", error);
            toast.error(error.response?.data?.message || "Erro ao alterar senha.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-2">
                        <Lock className="w-8 h-8" />
                        <Key className="w-8 h-8 -ml-4 shadow-xl" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Alteração Obrigatória</h1>
                    <p className="text-muted-foreground">Olá {user?.name}, por segurança você deve alterar sua senha temporária para continuar.</p>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Sua conta foi criada por um administrador. Defina uma senha forte e pessoal que você não utilize em outros serviços.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Senha Atual (Temporária)</label>
                            <input
                                type="password"
                                required
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Nova Senha</label>
                            <input
                                type="password"
                                required
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Atualizar Senha
                            </button>
                        </div>
                    </form>

                    <button
                        onClick={() => logout()}
                        className="w-full py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                        Sair da conta
                    </button>
                </div>
            </div>
        </div>
    );
}
