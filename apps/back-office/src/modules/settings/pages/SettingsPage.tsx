import { useEffect, useState } from 'react';
import { useHeader } from '../../../components/layout/HeaderContext';
import { Shield, Save, Loader2, FileText } from 'lucide-react';
import { useSettings, useUpdateSetting } from '../hooks/useSettings';

export function SettingsPage() {
    const { setHeader, resetHeader } = useHeader();
    const { data: settings, isLoading } = useSettings();
    const updateSetting = useUpdateSetting();

    const [formData, setFormData] = useState({
        terms_of_use: '',
        privacy_policy: '',
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                terms_of_use: settings.terms_of_use || '',
                privacy_policy: settings.privacy_policy || '',
            });
        }
    }, [settings]);

    const handleSave = async (key: string, value: string) => {
        await updateSetting.mutateAsync({ key, value });
    };

    useEffect(() => {
        setHeader({
            title: 'Configurações & LGPD',
        });
        return () => resetHeader();
    }, [setHeader, resetHeader]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-12">
            <div className="glass p-8 rounded-2xl border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Privacidade & Termos (LGPD)</h3>
                        <p className="text-sm text-muted-foreground">Gerencie o conteúdo legal exibido publicamente no site.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Termos de Uso
                            </label>
                            <button
                                onClick={() => handleSave('terms_of_use', formData.terms_of_use)}
                                disabled={updateSetting.isPending}
                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                            >
                                {updateSetting.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                Salvar Termos
                            </button>
                        </div>
                        <textarea
                            value={formData.terms_of_use}
                            onChange={(e) => setFormData({ ...formData, terms_of_use: e.target.value })}
                            className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            placeholder="Digite os termos de uso aqui (Markdown suportado no site)..."
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Política de Privacidade
                            </label>
                            <button
                                onClick={() => handleSave('privacy_policy', formData.privacy_policy)}
                                disabled={updateSetting.isPending}
                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                            >
                                {updateSetting.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                Salvar Política
                            </button>
                        </div>
                        <textarea
                            value={formData.privacy_policy}
                            onChange={(e) => setFormData({ ...formData, privacy_policy: e.target.value })}
                            className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            placeholder="Digite a política de privacidade aqui..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
