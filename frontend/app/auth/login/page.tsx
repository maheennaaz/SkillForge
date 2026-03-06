'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await apiClient.post('/auth/login', { email, password });
            setAuth(data.user, data.accessToken);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-sky-500/20 blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                {/* Branding */}
                <motion.div variants={itemVariants} className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/20 mb-4 transform hover:rotate-12 transition-transform duration-500">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                            Skill<span className="text-sky-400">Forge</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg">Master the arts, forge your future.</p>
                    </div>
                </motion.div>

                {/* Glassmorphism Card */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Command</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within/input:text-sky-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/50 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="commander@skillforge.com"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Passkey</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within/input:text-sky-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-medium focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500/50 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </motion.div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-sm font-bold text-rose-500 text-center bg-rose-500/10 py-2 rounded-lg"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white py-4 rounded-2xl flex items-center justify-center space-x-2 text-lg font-bold shadow-xl shadow-sky-500/20 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Initiate Session</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-white/5 text-center relative z-10">
                        <p className="text-sm text-slate-400 font-medium">
                            First time at the forge?{' '}
                            <Link href="/auth/register" className="text-sky-400 font-black hover:text-sky-300 transition-colors">
                                Create Identity
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}

