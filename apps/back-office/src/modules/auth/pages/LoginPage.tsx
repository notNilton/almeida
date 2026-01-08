import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../../../lib/api';
import { AxiosError } from 'axios';
import { Lock, Mail, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.access_token, response.data.user);
            navigate('/');
        } catch (err) {
            const hasResponse = (err: unknown): err is AxiosError<{ message: string }> => {
                return !!err && typeof err === 'object' && 'response' in err;
            };

            if (hasResponse(err)) {
                setError(err.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.');
            } else {
                setError('Erro ao realizar login. Verifique suas credenciais.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse delay-1000"></div>

            <div className="w-full max-w-md p-4 relative z-10">
                <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">

                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <div className="text-center mb-10 space-y-2">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-primary/50 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <span className="text-black font-black text-2xl tracking-tighter">AL</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-white">Bem-vinda</h2>
                        <p className="text-sm text-muted-foreground font-medium">Acesse o painel administrativo</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                                <div className="p-1 rounded-full bg-red-500/20 text-red-500">
                                    <Lock className="w-3 h-3" />
                                </div>
                                <p className="text-xs text-red-500 font-bold mt-0.5">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">E-mail</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 text-muted-foreground group-focus-within/input:text-primary group-focus-within/input:bg-primary/10 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:bg-white/[0.05] focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/20 text-white"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Senha</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/5 text-muted-foreground group-focus-within/input:text-primary group-focus-within/input:bg-primary/10 transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:bg-white/[0.05] focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/20 text-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors focus:outline-none focus-visible:text-white"
                                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-black py-4 rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] group/btn"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Entrar
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-muted-foreground/40 font-mono uppercase tracking-widest">
                            Almeida Back-office v{__APP_VERSION__}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
