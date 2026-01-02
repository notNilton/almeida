import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Shield, Save, Upload, Info } from "lucide-react";
import { useProfile, useUpdateProfile } from "../hooks/useUsers";
import api from "../../../lib/api";

export function ProfilePage() {
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        avatarId: undefined as number | undefined,
        avatarUrl: "",
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                bio: profile.bio || "",
                avatarId: profile.avatarId,
                avatarUrl: profile.avatar?.url || "",
            });
        }
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
                bio: formData.bio,
                avatarId: formData.avatarId,
            });
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Profile update failed:", error);
            alert("Erro ao atualizar perfil.");
        }
    };

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
                <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e biografia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="space-y-4">
                    <div className="glass p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-2 border-primary/20 flex items-center justify-center">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-12 h-12 text-muted-foreground" />
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Upload className="w-6 h-6 text-white" />
                                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                            </label>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-lg">{profile?.name || 'Sem nome'}</h3>
                            <div className="flex items-center gap-1.5 justify-center mt-1 text-primary">
                                <Shield className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold tracking-wider uppercase">{profile?.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            <span>{profile?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="w-4 h-4" />
                            <span>Membro desde {profile ? new Date(profile.createdAt).toLocaleDateString() : '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    placeholder="Seu nome"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Biografia</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium h-32 resize-none"
                                    placeholder="Fale um pouco sobre você..."
                                />
                                <p className="text-[10px] text-muted-foreground">Esta biografia será exibida na página pública da equipe.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={updateProfile.isPending}
                                className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {updateProfile.isPending ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Salvar Alterações
                            </button>
                        </div>
                    </form>

                    {/* Password Change Section */}
                    <div className="mt-8">
                        <PasswordChangeForm />
                    </div>
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
        } catch (error: any) {
            console.error("Password change failed:", error);
            alert(error.response?.data?.message || "Erro ao alterar senha.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Alterar Senha
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Senha Atual</label>
                    <input
                        type="password"
                        required
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        placeholder="••••••••"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Nova Senha</label>
                    <input
                        type="password"
                        required
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        placeholder="••••••••"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Confirmar Nova Senha</label>
                    <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    Atualizar Senha
                </button>
            </div>
        </form>
    );
}
