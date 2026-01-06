import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    User,
    Calendar,
    FileSignature,
    FileText,
    Loader2,
    Plus,
    Trash2,
    ExternalLink,
    Pencil,
} from "lucide-react";
import { useEmployee } from "../hooks/useEmployees";
import type { Contract } from "../types/employee";
import { useContracts, useDeleteContract } from "../hooks/useContracts";
import { useDocuments, useDeleteDocument } from "../../documents/hooks/useDocuments";
import { useHeader } from "../../../components/layout/HeaderContext";
import { ContractForm } from "../components/ContractForm";
import { DocumentForm } from "../../documents/components/DocumentForm";
import { EditEmployeeForm } from "../components/EditEmployeeForm";
import { cn } from "../../../lib/utils";
import { toast } from "sonner";

type Tab = 'resumo' | 'contratos' | 'documentos';

export function EmployeeDetailsPage() {
    const { id } = useParams();
    const employeeId = id!;
    const { setHeader, resetHeader } = useHeader();

    const { data: employee, isLoading: isLoadingEmp } = useEmployee(employeeId);
    const { data: contracts, isLoading: isLoadingContracts } = useContracts(employeeId);
    const { data: documents } = useDocuments();

    const deleteContract = useDeleteContract();
    const deleteDocument = useDeleteDocument();

    const [activeTab, setActiveTab] = useState<Tab>('resumo');
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form state

    useEffect(() => {
        if (employee) {
            setHeader({
                title: employee.name,
                subtitle: `CPF: ${employee.cpf}`,
                tabs: (
                    <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
                        {(['resumo', 'contratos', 'documentos'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider",
                                    activeTab === tab
                                        ? "bg-primary text-black shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                ),
                actions: (
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm border border-white/10"
                    >
                        <Pencil className="w-4 h-4" />
                        Editar
                    </button>
                ),
            });
        }
        return () => resetHeader();
    }, [employee, setHeader, resetHeader, activeTab]);



    const employeeDocuments = documents?.filter(doc => doc.employeeId === employeeId);
    const handleDeleteContract = async (cid: string) => {
        // ... (existing code)
        if (confirm("Deseja realmente excluir este contrato?")) {
            await deleteContract.mutateAsync(cid);
            toast.success("Contrato excluído com sucesso!");
        }
    };

    const handleDeleteDocument = async (did: string) => {
        // ... (existing code)
        if (confirm("Deseja realmente excluir este documento?")) {
            await deleteDocument.mutateAsync(did);
            toast.success("Documento excluído com sucesso!");
        }
    };

    if (isLoadingEmp) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!employee) {
        return <div className="p-8 text-center text-muted-foreground">Funcionário não encontrado.</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Conteúdo */}
            <div className="grid grid-cols-1 gap-6">
                {activeTab === 'resumo' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        <div className="md:col-span-2 glass p-8 rounded-3xl border border-white/5 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                    <User className="w-5 h-5 text-primary" />
                                    Informações Básicas
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Nome Completo</p>
                                        <p className="text-lg font-medium">{employee.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">CPF</p>
                                        <p className="text-lg font-medium">{employee.cpf}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Matrícula</p>
                                        <p className="text-lg font-medium">{employee.registration || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                        <span className={cn(
                                            "inline-flex px-2 py-1 rounded text-[10px] font-bold border mt-1",
                                            employee.status === 'ACTIVE'
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}>
                                            {employee.status === 'ACTIVE' ? "ATIVO" : "INATIVO"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Datas do Sistema
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Criado em</p>
                                        <p className="text-sm">{new Date(employee.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Última atualização</p>
                                        <p className="text-sm">{new Date(employee.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="glass p-6 rounded-3xl border border-white/5">
                                <h4 className="font-bold text-sm mb-4">Resumo Executivo</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <FileSignature className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium">Contratos</span>
                                        </div>
                                        <span className="text-lg font-bold">{contracts?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium">Documentos</span>
                                        </div>
                                        <span className="text-lg font-bold">{employeeDocuments?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-6 rounded-3xl border border-blue-500/10">
                                <p className="text-xs text-muted-foreground mb-4">Ações Rápidas do Perfil</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <button
                                        onClick={() => setIsContractModalOpen(true)}
                                        className="flex items-center justify-between p-3 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-all border border-primary/10"
                                    >
                                        Novo Contrato
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsDocumentModalOpen(true)}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-all border border-white/10"
                                    >
                                        Upload Documento
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'contratos' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FileSignature className="w-6 h-6 text-primary" />
                                Contratos de {employee.name}
                            </h3>
                            <button
                                onClick={() => {
                                    setEditingContract(null);
                                    setIsContractModalOpen(true);
                                }}
                                className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-xs shadow-lg shadow-primary/20"
                            >
                                <Plus className="w-4 h-4 text-black" />
                                Novo Contrato
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contracts?.map((contract) => (
                                <div key={contract.id} className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group relative">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                                <FileSignature className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white uppercase tracking-wider">{contract.type}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">#{contract.id}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "px-2 py-1 rounded text-[10px] font-bold border",
                                            contract.status === 'ACTIVE'
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}>
                                            {contract.status === 'ACTIVE' ? "ATIVO" : "INATIVO"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Início</p>
                                            <p className="text-sm font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Fim</p>
                                            <p className="text-sm font-medium text-emerald-400">
                                                {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Indeterminado"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingContract(contract);
                                                setIsContractModalOpen(true);
                                            }}
                                            className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteContract(contract.id)}
                                            className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {contracts?.length === 0 && !isLoadingContracts && (
                                <div className="md:col-span-2 py-12 text-center text-muted-foreground bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    Nenhum contrato cadastrado para este colaborador.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'documentos' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="w-6 h-6 text-emerald-400" />
                                Documentos de {employee.name}
                            </h3>
                            <button
                                onClick={() => setIsDocumentModalOpen(true)}
                                className="flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-xl font-bold hover:opacity-90 transition-all text-xs shadow-lg shadow-emerald-500/20"
                            >
                                <Plus className="w-4 h-4 text-black" />
                                Novo Documento
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {employeeDocuments?.map((doc) => (
                                <div key={doc.id} className="glass p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col gap-4 group relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{doc.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground text-[8px] font-black tracking-widest uppercase border border-white/10">
                                                        {doc.type}
                                                    </span>
                                                    <span className={cn(
                                                        "px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border",
                                                        doc.status === 'PROCESSED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                            doc.status === 'ERROR' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                                "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                    )}>
                                                        {doc.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {doc.ocrData && (
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                            <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-50">Dados Selecionados (OCR)</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(doc.ocrData).slice(0, 4).map(([key, value]) => (
                                                    <div key={key} className="text-[10px] overflow-hidden">
                                                        <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                                                        <span className="text-white ml-1 font-medium truncate inline-block w-full">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {doc.upload?.url && (
                                            <a
                                                href={doc.upload.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="p-1.5 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {employeeDocuments?.length === 0 && (
                                <div className="md:col-span-2 py-12 text-center text-muted-foreground bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    Nenhum documento anexado.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modais */}
            {isContractModalOpen && (
                <ContractForm
                    isOpen={isContractModalOpen}
                    onClose={() => setIsContractModalOpen(false)}
                    employeeId={employeeId}
                    initialData={editingContract}
                />
            )}

            {isDocumentModalOpen && (
                <DocumentForm
                    isOpen={isDocumentModalOpen}
                    onClose={() => setIsDocumentModalOpen(false)}
                    onSubmit={async () => {
                        toast.promise(Promise.resolve(), {
                            loading: 'Salvando documento...',
                            success: 'Documento salvo (OCR será processado em breve)',
                            error: 'Erro ao salvar documento'
                        });
                        setIsDocumentModalOpen(false);
                    }}
                    initialData={undefined}
                />
            )}

            {/* Edit Employee Modal */}
            {isEditModalOpen && (
                <EditEmployeeForm
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    employee={employee}
                />
            )}
        </div>
    );
}
