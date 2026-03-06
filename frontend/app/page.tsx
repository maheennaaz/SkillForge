'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { BookOpen, Play, ChevronRight, Loader2, Star, Users, Award, ShieldCheck, ShoppingCart, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string;
    instructor_name?: string;
    progress_percent?: number;
    next_video_id?: number;
}

export default function HomePage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('search')?.toLowerCase() || '';
    const { user, cart, addToCart: addToCartStore } = useAuthStore();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [enrolledSubjects, setEnrolledSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await apiClient.get('/subjects');
                setSubjects(data);

                if (user) {
                    const { data: enrolled } = await apiClient.get('/subjects/enrolled');
                    setEnrolledSubjects(enrolled);
                }
            } catch (err) {
                console.error('Failed to fetch home content', err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [user]);

    const handleAddToCart = async (subject: Subject) => {
        if (!user) {
            window.location.href = '/auth/login';
            return;
        }
        try {
            await apiClient.post('/cart', { subjectId: subject.id });
            addToCartStore(subject);
        } catch (err: any) {
            if (err.response?.status === 400) {
                // Already in cart, just sync the store
                addToCartStore(subject);
            } else {
                console.error('Failed to add to cart', err);
            }
        }
    };

    const filteredSubjects = subjects.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
            </div>
        );
    }

    return (
        <div className="space-y-24 pb-24">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-white">
                <div className="relative z-10 max-w-3xl space-y-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="bg-sky-500/20 text-sky-400 px-4 py-2 rounded-full text-sm font-black tracking-widest uppercase">
                            {user ? `Welcome Back, ${user.name}` : 'Expert-Led Learning'}
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]"
                    >
                        {user ? 'Resume Your' : 'Forge Your Future'} <br />
                        <span className="text-sky-500 italic">{user ? 'Mastery.' : 'with Skills.'}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-xl leading-relaxed"
                    >
                        {user
                            ? "Pick up right where you left off and continue your journey to becoming a technology legend."
                            : "SkillForge provides the tools, mentors, and content you need to master modern technology and build a legendary career."}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4"
                    >
                        {user ? (
                            <Link
                                href={enrolledSubjects[0]?.next_video_id
                                    ? `/subjects/${enrolledSubjects[0].id}/video/${enrolledSubjects[0].next_video_id}`
                                    : "#continue-learning"}
                                className="bg-sky-500 hover:bg-sky-400 text-slate-900 font-black px-10 py-5 rounded-2xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-sky-500/20"
                            >
                                Continue Learning
                            </Link>
                        ) : (
                            <Link href="/auth/register" className="bg-sky-500 hover:bg-sky-400 text-slate-900 font-black px-10 py-5 rounded-2xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-sky-500/20">
                                Start Forging Now
                            </Link>
                        )}
                    </motion.div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-l from-sky-500 to-transparent" />
                </div>
            </section>

            {/* Continue Learning Section (Only for Students) */}
            {user && enrolledSubjects.length > 0 && (
                <section id="continue-learning" className="space-y-12">
                    <div className="flex items-end justify-between">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900">Continue Learning</h2>
                            <p className="text-slate-500 font-medium font-mono uppercase text-xs tracking-widest bg-slate-100 px-3 py-1 rounded-full w-fit">Resume where you left off</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {enrolledSubjects.map((subject, idx) => (
                            <motion.div key={`enrolled-${subject.id}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                                <Link
                                    href={subject.next_video_id
                                        ? `/subjects/${subject.id}/video/${subject.next_video_id}`
                                        : `/subjects/${subject.id}`}
                                    className="block group"
                                >
                                    <div className="card border-2 border-sky-100 bg-sky-50/30 hover:bg-white transition-all space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center">
                                                <Play className="w-6 h-6 fill-current" />
                                            </div>
                                            <span className={`text-xs font-black uppercase ${subject.progress_percent === 100 ? 'text-green-600' : 'text-sky-600'}`}>
                                                {subject.progress_percent === 100 ? 'Completed' : 'In Progress'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">{subject.title}</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                                <span>Progress</span>
                                                <span>{subject.progress_percent}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${subject.progress_percent}%` }}
                                                    className="bg-sky-500 h-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-400 font-bold text-center">
                <div className="flex flex-col items-center gap-2">
                    <Star className="text-sky-500 w-6 h-6" />
                    <span>4.9/5 Rating</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Users className="text-sky-500 w-6 h-6" />
                    <span>10k+ Students</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Star className="text-sky-500 w-6 h-6" />
                    <span>Expert Mentors</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="text-sky-500 w-6 h-6" />
                    <span>Verified Content</span>
                </div>
            </div>

            {/* Courses Grid */}
            <section className="space-y-12">
                <div className="flex items-end justify-between">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">
                            {query ? `Search results for "${query}"` : "Featured Courses"}
                        </h2>
                        <p className="text-slate-500 font-medium">Hand-picked subjects to accelerate your growth.</p>
                    </div>
                    <Link href="/" className="text-sky-600 font-black flex items-center gap-2 group hover:underline underline-offset-8">
                        View all courses <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSubjects.map((subject, idx) => (
                        <motion.div key={subject.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                            <Link href={`/subjects/${subject.id}`} className="group block h-full">
                                <div className="card h-full flex flex-col font-medium">
                                    <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-sky-500 group-hover:text-white transition-all transform group-hover:rotate-12">
                                        <BookOpen className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-1 text-slate-900 tracking-tight">{subject.title}</h3>
                                    <p className="text-sky-600 font-bold text-xs uppercase tracking-widest mb-4">By {subject.instructor_name || 'Elite Mentor'}</p>
                                    <p className="text-slate-500 mb-8 flex-grow line-clamp-3 leading-relaxed">
                                        {subject.description}
                                    </p>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(subject);
                                            }}
                                            disabled={cart.some(i => i.id === subject.id)}
                                            className="text-sky-600 font-black flex items-center gap-1 group-hover:gap-3 transition-all disabled:text-slate-400"
                                        >
                                            {cart.some(i => i.id === subject.id) ? 'Added to Cart' : 'Add to cart'} <ShoppingCart className="w-4 h-4" />
                                        </button>
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                    {filteredSubjects.length === 0 && (
                        <div className="col-span-full py-24 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">No courses found</h3>
                            <p className="text-slate-500">Try adjusting your search terms to find what you're looking for.</p>
                            <Link href="/" className="btn-primary inline-flex">Clear Search</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
