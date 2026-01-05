import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Shield, Save, Upload, ChevronDown } from "lucide-react";
import { useProfile, useUpdateProfile } from "../hooks/useUsers";
import api from "../../../lib/api";
import type { User } from "../types/user";

export function ProfilePage() {
    const { data: profile, isLoading } = useProfile();

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <UserIcon className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Perfil não encontrado</h2>
                    <p className="text-muted-foreground text-sm max-w-xs">Não conseguimos recuperar suas informações no momento.</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-black px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                >
                    Recarregar Página
                </button>
            </div>
        );
    }

    return <ProfileForm profile={profile} />;
}

function ProfileForm({ profile }: { profile: User }) {
    const updateProfile = useUpdateProfile();
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [formData, setFormData] = useState({
        name: profile.name || "",
        avatarId: profile.avatarId,
        avatarUrl: profile.avatar?.url || "",
    });

    // Ensure state stays in sync if profile refetches (e.g. after update)
    useEffect(() => {
        setFormData({
            name: profile.name || "",
            avatarId: profile.avatarId,
            avatarUrl: profile.avatar?.url || "",
        });
    }, [profile]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const form = new FormData();
                form.append('file', file);
                const res = await api.post('/uploads', form);
                setFormData(prev => ({
                    ...prev,
                    avatarId: res.data.id,
                    avatarUrl: res.data.url
                }));
            } catch (error) {
                console.error("Avatar upload failed:", error);
                alert("Erro ao carregar avatar.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync({
                name: formData.name,
                avatarId: formData.avatarId,
            });
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Profile update failed:", error);
            alert("Erro ao atualizar perfil.");
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-12 space-y-16">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <div className="w-8 h-px bg-primary/30" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Configurações Gerais</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Perfil</h1>
                </div>

                <div className="flex items-center gap-6 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500/50" />
                        Sistema Online
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    ID: {profile.id}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Visual Identity Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="relative group perspective-1000">
                        <div className="w-full aspect-square rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_50px_-12px_rgba(var(--primary-rgb),0.3)] group-hover:-rotate-1">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-32 h-32 text-muted-foreground/10" />
                            )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[3rem] cursor-pointer backdrop-blur-md scale-95 group-hover:scale-100">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Alterar Foto</span>
                            </div>
                            <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                        </label>
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <div className="bg-primary/10 text-primary w-fit px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 mx-auto lg:ml-0">
                            {profile.role}
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">{profile.name || "Usuário"}</h2>
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground font-medium">
                            <Mail className="w-4 h-4 opacity-30" />
                            {profile.email}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${showPasswordForm ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/20'}`}
                        >
                            <div className="flex items-center gap-4">
                                <Shield className={`w-5 h-5 ${showPasswordForm ? 'opacity-100' : 'opacity-30'}`} />
                                <span className="font-black text-xs uppercase tracking-widest">Segurança</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${showPasswordForm ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showPasswordForm ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                            <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                                <PasswordChangeForm />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="grid grid-cols-1 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em] pl-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] px-8 py-6 text-xl focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-white/[0.05] transition-all font-bold placeholder:text-muted-foreground/10"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div className="space-y-4 opacity-40">
                                <label className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.4em] pl-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                    E-mail de Acesso
                                </label>
                                <div className="w-full bg-white/[0.01] border border-white/5 rounded-[2rem] px-8 py-6 text-xl font-bold italic text-muted-foreground/50">
                                    {profile.email}
                                </div>
                                <p className="text-[9px] text-muted-foreground/30 uppercase tracking-widest pl-2">Informação protegida e não editável</p>
                            </div>
                        </div>

                        <div className="flex justify-start">
                            <button
                                type="submit"
                                disabled={updateProfile.isPending}
                                className="group relative bg-white text-black px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    {updateProfile.isPending ? (
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    Atualizar Perfil
                                </span>
                                <div className="absolute inset-0 bg-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                            </button>
                        </div>
                    </form>

                    <footer className="mt-32 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-20 hover:opacity-100 transition-opacity">
                        <div className="text-[9px] font-bold uppercase tracking-[0.4em]">
                            Desde {new Date(profile.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.4em]">
                            Almeida Back-Office &copy; {new Date().getFullYear()}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

function PasswordChangeForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/auth/change-password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            alert("Senha alterada com sucesso!");
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: unknown) {
            console.error("Password change failed:", error);
            const message = error instanceof Error ? error.message : "Erro ao alterar senha.";
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest pl-1">Senha Atual</label>
                    <input
                        type="password"
                        required
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-bold"
                        placeholder="••••••••"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest pl-1">Nova Senha</label>
                        <input
                            type="password"
                            required
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-bold"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest pl-1">Confirmar</label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-primary/30 transition-all font-bold"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
                {isLoading ? "Processando..." : "Confirmar Alteração"}
            </button>
        </form>
    );
}
