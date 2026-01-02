import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <h1 className="text-[12rem] font-black text-white opacity-[0.02] select-none leading-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary blur-3xl" />
                        <div className="absolute text-5xl font-black text-white tracking-tighter">Ops!</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">Página não encontrada</h2>
                    <p className="text-muted-foreground">A página que você está procurando não existe ou foi movida.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
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
