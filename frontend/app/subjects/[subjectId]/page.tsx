'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { BookOpen, Clock, Play, User, CheckCircle2, ShoppingCart, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export default function SubjectPage() {
    const { subjectId } = useParams();
    const router = useRouter();
    const { user, cart, addToCart: addToCartStore } = useAuthStore();
    const [subject, setSubject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [lastVideoId, setLastVideoId] = useState<number | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch basic info
                const { data: subData } = await apiClient.get(`/subjects/${subjectId}`);
                setSubject(subData);

                if (user) {
                    try {
                        // Check if enrolled and get tree for resume logic
                        const { data: treeData } = await apiClient.get(`/subjects/${subjectId}/tree`);
                        setIsEnrolled(true);

                        // Intelligent Resume: Find first video not completed, or default to first
                        const allVideos = treeData.sections.flatMap((s: any) => s.videos);
                        const lastIncomplete = allVideos.find((v: any) => !v.is_completed);
                        setLastVideoId(lastIncomplete ? lastIncomplete.id : allVideos[0]?.id);
                    } catch (err) {
                        setIsEnrolled(false);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [subjectId, user]);

    const handleAction = async () => {
        if (!user) {
            router.push('/auth/login');
            return;
        }

        if (isEnrolled && lastVideoId) {
            router.push(`/subjects/${subjectId}/video/${lastVideoId}`);
            return;
        }

        // Handle Add to Cart
        try {
            await apiClient.post('/cart', { subjectId: parseInt(subjectId as string) });
            addToCartStore(subject);
            router.push('/cart');
        } catch (err: any) {
            if (err.response?.status === 400) {
                addToCartStore(subject);
                router.push('/cart');
            }
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
        </div>
    );

    if (!subject) return <div className="text-center py-24 text-slate-500 font-bold">Course not found</div>;

    const objectives = typeof subject.learning_objectives === 'string'
        ? JSON.parse(subject.learning_objectives)
        : (subject.learning_objectives || []);

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 px-4 pt-8">
            {/* Hero Banner */}
            <section className="relative bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden shadow-2xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <span className="bg-sky-500/20 text-sky-400 px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-sky-500/30">
                                Global Certification
                            </span>
                        </motion.div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                            {subject.title}
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed font-medium">
                            {subject.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-8 text-sm font-bold">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-sky-400" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">Instructor</p>
                                    <p className="text-white">{subject.instructor_name || 'Elite Mentor'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">Curriculum</p>
                                    <p className="text-white">Expertly Forged</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 space-y-8 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-sky-500/20 mb-4 transform hover:scale-110 transition-transform duration-500">
                                <Play className="w-10 h-10 text-white fill-current translate-x-1" />
                            </div>
                            <div className="space-y-4 w-full">
                                <p className="text-slate-400 font-medium">Master this technology today.</p>
                                <h3 className="text-3xl font-black">{isEnrolled && subject.progress_percent === 100 ? 'Course Completed!' : 'Ready to Start?'}</h3>
                                {isEnrolled && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            <span>Overall Progress</span>
                                            <span>{subject.progress_percent}%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${subject.progress_percent}%` }}
                                                className={`h-full ${subject.progress_percent === 100 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)]'}`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleAction}
                                className="w-full bg-white text-slate-950 hover:bg-sky-400 transition-all font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-xl active:scale-95"
                            >
                                <span>{isEnrolled ? 'Resume Forging' : 'Enroll in Course'}</span>
                                {isEnrolled ? <ArrowRight className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                            </button>
                            <p className="text-xs text-slate-500">100% money-back guarantee for first 30 days.</p>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-16">
                    {/* Learning Objectives */}
                    <section className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">What you will learn</h2>
                            <div className="w-20 h-2 bg-sky-500 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {objectives.length > 0 ? objectives.map((obj: string, i: number) => (
                                <div key={i} className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-sky-200 transition-all group">
                                    <CheckCircle2 className="w-6 h-6 text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
                                    <p className="text-slate-700 font-bold leading-snug">{obj}</p>
                                </div>
                            )) : (
                                ['Build Production Applications', 'Master Core Architecture', 'Scale your skills globally', 'Get industry certified'].map((obj, i) => (
                                    <div key={i} className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <CheckCircle2 className="w-6 h-6 text-sky-500 shrink-0" />
                                        <p className="text-slate-700 font-bold leading-snug">{obj}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* About this Course */}
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Overview</h2>
                        <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-loose text-lg">
                            <p>This comprehensive course on {subject.title} has been meticulously crafted to bridge the gap between theoretical knowledge and practical mastery. Whether you are looking to start a new career or upscale your existing expertise, our elite mentors guide you through every complex topic with real-world examples and hands-on projects.</p>
                            <p>By the end of this journey, you won't just know {subject.title}; you will be able to apply it in high-stakes professional environments, backed by our verified SkillForge certification.</p>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Course Summary Card */}
                    <div className="card p-10 bg-slate-50 space-y-8 sticky top-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Clock className="w-6 h-6 text-sky-600" />
                            This Course Includes
                        </h3>
                        <ul className="space-y-5">
                            {[
                                { text: 'Expert Tutorials', icon: Play },
                                { text: 'Certification Exam', icon: CheckCircle2 },
                                { text: 'Lifetime Access', icon: Clock },
                                { text: 'Premium Assets', icon: BookOpen },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-600 font-bold">
                                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-sky-500" />
                                    </div>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                        <div className="pt-8 border-t border-slate-200">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 bg-slate-200 shadow-sm" />
                                    ))}
                                </div>
                                <p className="text-xs font-black text-slate-400">Join 10k+ <br /> Students</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
