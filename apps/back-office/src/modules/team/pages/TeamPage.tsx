import { useState } from "react";
import { Plus, Mail, Pencil, Trash2 } from "lucide-react";
import type { TeamMember } from "../types/team";
import { useTeam, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember } from "../hooks/useTeam";
import { TeamMemberForm } from "../components/TeamMemberForm";

export function TeamPage() {
    const { data: team, isLoading, isError } = useTeam();
    const createMember = useCreateTeamMember();
    const updateMember = useUpdateTeamMember();
    const deleteMember = useDeleteTeamMember();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined);

    const handleCreate = () => {
        setEditingMember(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Tem certeza que deseja remover este membro?')) {
            await deleteMember.mutateAsync(id);
        }
    };

    const handleSubmit = async (data: Omit<TeamMember, 'id'>) => {
        if (editingMember) {
            await updateMember.mutateAsync({ ...data, id: editingMember.id });
        } else {
            await createMember.mutateAsync(data);
        }
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
                    <p className="text-muted-foreground mt-1">Gerencie os colaboradores e contribuintes.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Novo Membro
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {isError ? (
                    <div className="col-span-full p-8 text-center text-red-500">Erro ao carregar equipe.</div>
                ) : (
                    team?.map((member: TeamMember) => (
                        <div key={member.id} className="glass p-6 rounded-2xl border border-white/5 relative group hover:border-white/10 transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="p-1 hover:bg-white/5 rounded text-muted-foreground hover:text-white"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-primary/20 to-blue-500/20 flex items-center justify-center border border-white/5 text-primary font-bold">
                                    {member.image ? (
                                        <img src={member.image.url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        member.name.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {member.status}
                                </span>
                                {member.email && (
                                    <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {!isLoading && team?.length === 0 && (
                    <div className="col-span-full p-8 text-center text-muted-foreground">Nenhum membro encontrado.</div>
                )}
            </div>

            <TeamMemberForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingMember}
                isLoading={createMember.isPending || updateMember.isPending}
            />
        </div>
    );
}
