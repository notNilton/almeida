import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in fill-mode-both duration-500">
                <div className="flex justify-center">
                    <div className="p-4 rounded-3xl bg-red-500/10 text-red-500 animate-bounce">
                        <AlertCircle className="w-16 h-16" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-5xl font-black text-white tracking-tighter">Erro 500</h1>
                    <h2 className="text-2xl font-bold text-white">Algo deu errado</h2>
                    <p className="text-muted-foreground">Ocorreu um erro interno no servidor. Nossa equipe já foi notificada.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Tentar Novamente
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-bold hover:opacity-90 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
