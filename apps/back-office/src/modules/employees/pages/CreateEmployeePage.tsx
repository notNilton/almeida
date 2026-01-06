import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, File as FileIcon, Loader2, Check, User, CreditCard, Hash } from "lucide-react";
import { useHeader } from "../../../components/layout/HeaderContext";
import { useCreateEmployee } from "../hooks/useEmployees";
import { cn } from "../../../lib/utils";
import { toast } from "sonner";
import api from "../../../lib/api";

export function CreateEmployeePage() {
    const { setHeader, resetHeader } = useHeader();
    const navigate = useNavigate();
    const createEmployee = useCreateEmployee();

    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{ id: string, name: string, size: number } | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        cpf: "",
        registration: "",
        status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    });

    useEffect(() => {
        setHeader({
            title: "Novo Funcionário",
            subtitle: "Cadastro manual ou via upload de contrato",
            actions: (
                <Link
                    to="/funcionarios"
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm border border-white/10"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>
            ),
        });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await api.post('/uploads', form);
            const uploadData = res.data;

            setUploadedFile({
                id: uploadData.id,
                name: uploadData.originalName,
                size: uploadData.size
            });

            toast.success("Arquivo enviado com sucesso!");

            // Simulating OCR data fill (In a real scenario, we'd wait for OCR result)
            // if (uploadData.ocrResults) { ... }

        } catch {
            toast.error("Erro ao enviar arquivo.");
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) await handleFileUpload(file);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await handleFileUpload(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                // Include uploaded contract ID if needed by API, e.g. contractFileId: uploadedFile?.id
            };
            await createEmployee.mutateAsync(payload);
            toast.success("Funcionário cadastrado com sucesso!");
            navigate("/funcionarios");
        } catch {
            toast.error("Erro ao cadastrar funcionário.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column: Upload */}
            <div className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-500">
                <div className="glass p-8 rounded-[2rem] border border-white/5 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <h3 className="text-2xl font-bold mb-2">Upload de Contrato</h3>
                    <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
                        Arraste um PDF ou imagem do contrato para preencher automaticamente os dados.
                    </p>

                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={cn(
                            "w-full max-w-sm aspect-video rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer relative",
                            isDragging
                                ? "border-primary bg-primary/10 scale-105"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        )}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept=".pdf,image/*"
                        />

                        {isUploading ? (
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        ) : uploadedFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                    <Check className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-white max-w-[200px] truncate">{uploadedFile.name}</p>
                                <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setUploadedFile(null);
                                    }}
                                    className="z-10 text-xs text-red-400 hover:text-red-300 hover:underline mt-2"
                                >
                                    Remover
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-lg",
                                    isDragging ? "bg-primary text-black" : "bg-white/5 text-muted-foreground"
                                )}>
                                    <Upload className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">Clique ou arraste aqui</p>
                                    <p className="text-xs text-muted-foreground">PDF, JPEG, PNG</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-white/5">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <FileIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-1">Como funciona o OCR?</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Ao fazer upload do contrato, nosso sistema identifica automaticamente o nome, CPF e outros dados do funcionário para agilizar o cadastro.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="glass p-8 rounded-[2rem] border border-white/5 flex flex-col animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Dados do Funcionário
                </h3>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Nome Completo <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                placeholder="Nome completo do funcionário"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">CPF <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <CreditCard className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                required
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                placeholder="000.000.000-00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Matrícula</label>
                            <div className="relative group">
                                <Hash className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    value={formData.registration}
                                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                    placeholder="Opcional"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Status</label>
                            <div className="relative">
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="ACTIVE" className="bg-neutral-900">Ativo</option>
                                    <option value="INACTIVE" className="bg-neutral-900">Inativo</option>
                                </select>
                                <div className="absolute right-4 top-3.5 pointer-events-none">
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <button
                            type="submit"
                            disabled={createEmployee.isPending}
                            className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {createEmployee.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Confirmar Cadastro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
