'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, CheckCircle, Clock, Flame,
    Play, Rocket, Target, Award,
    ArrowRight, Star, Brain, ChartBar,
    Database, Code, Cpu, LucideIcon,
    Pause, Timer, RotateCcw, Compass, User,
    ShieldCheck, FileText
} from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

interface Subject {
    id: number;
    title: string;
    progress_percent: number;
    total_videos: number;
    completed_videos: number;
    total_quizzes: number;
    passed_quizzes: number;
    next_video_id?: number;
}

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [enrolled, setEnrolled] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [streak, setStreak] = useState(0);
    const [dailyTracker, setDailyTracker] = useState<boolean[]>(new Array(7).fill(false));
    const [focusTime, setFocusTime] = useState(25 * 60);
    const [isFocusActive, setIsFocusActive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const { data } = await apiClient.get('/subjects/enrolled');
                setEnrolled(Array.isArray(data) ? data : []);

                // Load local stats
                try {
                    const savedTracker = localStorage.getItem(`tracker_${user.id}`);
                    if (savedTracker) {
                        const parsedTracker = JSON.parse(savedTracker);
                        setDailyTracker(parsedTracker);
                        calculateStreak(parsedTracker);
                    }
                } catch (e) { console.error('Local storage error', e); }

            } catch (err) {
                console.error('Failed to load dashboard data', err);
                setEnrolled([]); // Fallback
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const calculateStreak = (tracker: boolean[]) => {
        let currentStreak = 0;
        // Count consecutive days from most recent (end of array) backwards
        for (let i = tracker.length - 1; i >= 0; i--) {
            if (tracker[i]) {
                currentStreak++;
            } else if (currentStreak > 0) {
                break; // Streak broken
            }
        }
        setStreak(currentStreak);
    };

    // Daily Tracker Logic
    const toggleDay = (index: number) => {
        const newTracker = [...dailyTracker];
        newTracker[index] = !newTracker[index];
        setDailyTracker(newTracker);
        if (user) localStorage.setItem(`tracker_${user.id}`, JSON.stringify(newTracker));
        calculateStreak(newTracker);
    };

    // Focus Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isFocusActive && focusTime > 0) {
            interval = setInterval(() => {
                setFocusTime(prev => prev - 1);
            }, 1000);
        } else if (focusTime === 0) {
            setIsFocusActive(false);
            alert("Focus session complete! Take a break.");
        }
        return () => clearInterval(interval);
    }, [isFocusActive, focusTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!user) return <div className="p-12 text-center">Please login to view your dashboard.</div>;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Rocket className="w-12 h-12 text-sky-600 animate-bounce" />
            </div>
        );
    }

    const stats = {
        enrolled: enrolled.length,
        completed: enrolled.filter(s => Number(s.progress_percent) >= 90).length, // More permissive threshold
        lessons: enrolled.reduce((acc, s) => acc + Number(s.completed_videos || 0), 0),
        quizzes: enrolled.reduce((acc, s) => acc + Number(s.passed_quizzes || 0), 0),
        hasDataAnalytics: enrolled.some(s => s.title.toLowerCase().includes('data analytics') && Number(s.progress_percent) >= 90)
    };

    const sortedEnrolled = [...enrolled].sort((a, b) => Number(b.progress_percent || 0) - Number(a.progress_percent || 0));
    const continueSubject = sortedEnrolled[0];

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-12 space-y-12 bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* Header / Learning Control Panel */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter"
                    >
                        Welcome back, <span className="text-sky-600 italic block md:inline">{user.name}</span>.
                    </motion.h1>
                    <p className="text-slate-500 font-medium">Your personal growth control center. Keep forging excellence!</p>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                    <StatCard icon={BookOpen} label="Enrolled" value={stats.enrolled} />
                    <StatCard icon={CheckCircle} label="Completed" value={stats.completed} />
                    <StatCard icon={Play} label="Lessons" value={stats.lessons} />
                    <StatCard icon={FileText} label="Quizzes" value={stats.quizzes} />
                </div>
            </header>

            {/* Main Grid: Learning Tracker & Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Continue Learning Widget */}
                    {continueSubject && (
                        <motion.section
                            whileHover={{ y: -5 }}
                            className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl group border border-white/5"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-500">
                                <Rocket className="w-48 h-48" />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-2">
                                    <span className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                        {Number(continueSubject.progress_percent) >= 90 ? 'Achievement Unlocked' : 'Active Path'}
                                    </span>
                                    {Number(continueSubject.progress_percent) >= 90 && (
                                        <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Completed
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black tracking-tighter">{continueSubject.title}</h2>
                                    <p className="text-slate-400 font-medium text-lg">
                                        {Number(continueSubject.progress_percent) >= 90
                                            ? "Expertise Unlocked! Your certificate is ready."
                                            : Number(continueSubject.completed_videos) >= Number(continueSubject.total_videos)
                                                ? `${Number(continueSubject.total_quizzes) - Number(continueSubject.passed_quizzes)} Chapter Assessments Pending • Final Stretch!`
                                                : `Next: Module ${Number(continueSubject.completed_videos) + 1} • Keep it up!`}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-black text-sky-400 uppercase tracking-widest">
                                        <span>Mastery Level</span>
                                        <span>{continueSubject.progress_percent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${continueSubject.progress_percent}%` }}
                                            className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={continueSubject.next_video_id
                                            ? `/subjects/${continueSubject.id}/video/${continueSubject.next_video_id}`
                                            : `/subjects/${continueSubject.id}`}
                                        className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-black transition-all flex items-center gap-2 hover:bg-sky-500 hover:text-white group shadow-xl"
                                    >
                                        {Number(continueSubject.progress_percent) >= 90 ? "Review Journey" : "Resume Learning"}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Skill Radar */}
                    <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Brain className="w-8 h-8 text-sky-600" /> Skill Progress Radar
                            </h3>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aura analysis</p>
                                <p className="text-sm font-bold text-sky-600">Growth Score: {Math.min(100, 40 + stats.lessons * 2)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SkillBar icon={Code} label="Programming" progress={stats.enrolled > 0 ? 88 : 0} />
                            <SkillBar
                                icon={Database}
                                label="Data Analysis"
                                progress={enrolled.find(s => s.title.toLowerCase().includes('data analytics'))?.progress_percent || (stats.enrolled > 0 ? 10 : 0)}
                            />
                            <SkillBar icon={Target} label="Problem Solving" progress={Math.min(100, 60 + stats.lessons)} />
                            <SkillBar icon={Cpu} label="Machine Learning" progress={stats.enrolled > 1 ? 45 : 5} />
                        </div>
                    </section>
                </div>

                {/* Sidebar Widget */}
                <div className="space-y-8">
                    <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-8">
                        <div className="space-y-2 text-center">
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-6 py-2 rounded-full border border-orange-100 italic shadow-sm">
                                <Flame className="w-5 h-5 fill-current" />
                                <span className="text-base font-black tracking-tight">{streak} Day Learning Streak</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 pt-2">Daily Ritual</h3>
                        </div>
                        <div className="flex justify-between gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <button
                                    key={i}
                                    onClick={() => toggleDay(i)}
                                    className={`flex-1 h-14 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${dailyTracker[i]
                                        ? 'bg-sky-600 border-sky-600 text-white shadow-xl shadow-sky-500/30'
                                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-sky-200'
                                        }`}
                                >
                                    <span className="text-[10px] uppercase font-black">{day}</span>
                                    {dailyTracker[i] && <CheckCircle className="w-3.5 h-3.5 mt-1 animate-in zoom-in duration-300" />}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-center text-slate-400 font-bold px-4 leading-relaxed uppercase tracking-wide">
                            Consistency is the architect of mastery.
                        </p>
                    </section>
                </div>
            </div>

            {/* Focus Engine */}
            <div className="max-w-4xl mx-auto py-12">
                <section className="bg-sky-600 rounded-[3rem] p-12 text-white shadow-2xl space-y-8 relative overflow-hidden group">
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-500 rounded-full blur-[100px] opacity-50 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                        <div className="space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-sky-500/30 px-4 py-1.5 rounded-full border border-sky-400/30">
                                <Timer className="w-5 h-5 text-sky-200 animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest text-sky-100">Productivity Hub</span>
                            </div>
                            <h3 className="text-4xl font-black tracking-tighter">Focus Engine</h3>
                            <p className="text-sky-100/80 font-medium max-w-sm">
                                Deep work session: 25 minutes of pure concentration.
                            </p>
                        </div>
                        <div className="text-center md:text-right flex flex-col items-center md:items-end space-y-6">
                            <motion.span
                                key={focusTime}
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-8xl font-black tabular-nums tracking-tighter drop-shadow-2xl"
                            >
                                {formatTime(focusTime)}
                            </motion.span>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsFocusActive(!isFocusActive)}
                                    className="bg-white text-sky-700 font-black px-10 py-4 rounded-[2rem] hover:bg-sky-50 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 text-lg"
                                >
                                    {isFocusActive ? <><Pause className="w-6 h-6" /> Pause</> : <><Play className="w-6 h-6 fill-current" /> Ignite</>}
                                </button>
                                <button
                                    onClick={() => { setIsFocusActive(false); setFocusTime(25 * 60); }}
                                    className="w-16 h-16 bg-sky-500 rounded-[2rem] hover:bg-sky-400 transition-all flex items-center justify-center active:scale-90 shadow-xl border border-sky-400/30"
                                >
                                    <RotateCcw className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Recommendations & Quick Nav */}
            <div className="space-y-12 py-12 border-t border-slate-200 mt-12 text-center">
                <div className="space-y-2">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Personalized Recommendations</h3>
                    <p className="text-slate-500 font-medium">Elevate your mastery with these suggested paths.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <RecommendCard
                        title="Advanced Python for Analytics"
                        desc="Deepen your Data Analytics path"
                        icon={BookOpen}
                        href="/subjects/1"
                    />
                    <RecommendCard
                        title="Machine Learning Foundations"
                        desc="Start the AI masterclass"
                        icon={Cpu}
                        href="/subjects/2"
                    />
                    <RecommendCard
                        title="Algorithm Optimization"
                        desc="Master Big O Foundations"
                        icon={Target}
                        href="/"
                    />
                </div>
                <div className="max-w-4xl mx-auto pt-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-2xl border-4 border-slate-800">
                        <QuickNavButton icon={BookOpen} label="Open Courses" href="/" />
                        <QuickNavButton icon={Compass} label="Learning Roadmap" href="/roadmap" />
                        <QuickNavButton icon={Star} label="Career Support" href="/career" />
                        <QuickNavButton icon={User} label="My Profile" href="/profile" />
                    </div>
                </div>
            </div>

            {/* Achievements Section */}
            <section className="space-y-8 pt-12 pb-24">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <Award className="w-8 h-8 text-sky-600 underline decoration-sky-500/30 decoration-8 underline-offset-8" />
                    <h3 className="text-3xl font-black tracking-tighter">Your Achievements</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                    <AchievementBadge
                        icon={Rocket}
                        title="Initiator"
                        desc="Enrolled in 1st Course"
                        completed={stats.enrolled >= 1}
                        href="/"
                    />
                    <AchievementBadge
                        icon={Play}
                        title="Lesson Legend"
                        desc="Watched 5 Lessons"
                        completed={stats.lessons >= 5}
                        href="/"
                    />
                    <AchievementBadge
                        icon={Flame}
                        title="Atomic Learning"
                        desc="3 Day Streak"
                        completed={streak >= 3}
                        href="/dashboard"
                    />
                    <AchievementBadge
                        icon={Award}
                        title="Data Master"
                        desc="Completed Data Analytics"
                        completed={stats.hasDataAnalytics || stats.completed >= 1}
                        href="/subjects/1"
                    />
                    <AchievementBadge
                        icon={ShieldCheck}
                        title="SkillForge Elite"
                        desc="Early Access Member"
                        completed={true}
                        href="/profile"
                    />
                </div>
            </section>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: number }) {
    return (
        <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center min-w-[120px] transition-all hover:border-sky-300 group">
            <Icon className="w-6 h-6 text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-3xl font-black text-slate-900 leading-none">{value}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</span>
        </div>
    );
}

function SkillBar({ icon: Icon, label, progress }: { icon: LucideIcon, label: string, progress: number }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-sky-50 transition-colors">
                        <Icon className="w-5 h-5 text-sky-600" />
                    </div>
                    <span className="text-base font-bold text-slate-800">{label}</span>
                </div>
                <span className="text-sm font-black text-sky-600 italic">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.3)]"
                />
            </div>
        </div>
    );
}

function AchievementBadge({ icon: Icon, title, desc, completed, href }: { icon: LucideIcon, title: string, desc: string, completed: boolean, href: string }) {
    return (
        <Link
            href={href}
            className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center space-y-4 group relative overflow-hidden ${completed
                ? 'bg-white border-sky-200 shadow-xl hover:border-sky-500 hover:-translate-y-2 cursor-pointer'
                : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300 cursor-help'
                }`}
        >
            {/* Background Glow for Completed */}
            {completed && (
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-sky-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            )}

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${completed
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/40 group-hover:rotate-12'
                : 'bg-slate-200 text-slate-400 grayscale'
                }`}>
                <Icon className="w-8 h-8" />
                {!completed && (
                    <div className="absolute -top-2 -right-2 bg-slate-400 text-white p-1 rounded-full border-2 border-slate-50">
                        <Clock className="w-2 h-2" />
                    </div>
                )}
            </div>

            <div className="space-y-1 relative z-10">
                <p className={`text-base font-black tracking-tight ${completed ? 'text-slate-900' : 'text-slate-500'}`}>
                    {title}
                </p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {desc}
                </p>
            </div>

            <div className="pt-2 relative z-10">
                {completed ? (
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Earned
                    </span>
                ) : (
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        In Progress
                    </span>
                )}
            </div>
        </Link>
    );
}

function RecommendCard({ title, desc, icon: Icon, href }: { title: string, desc: string, icon: LucideIcon, href: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-sky-400 transition-all shadow-lg group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
                <Icon className="w-24 h-24" />
            </div>
            <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-sky-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{title}</h4>
                    <p className="text-xs font-black text-sky-600 uppercase tracking-widest">{desc}</p>
                </div>
                <Link href={href} className="w-full bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] py-4 rounded-2xl block text-center hover:bg-sky-600 transition-all shadow-xl shadow-slate-900/10">
                    Ignite Skill
                </Link>
            </div>
        </motion.div>
    );
}

function QuickNavButton({ icon: Icon, label, href }: { icon: LucideIcon, label: string, href: string }) {
    return (
        <Link href={href} className="bg-slate-800 p-6 rounded-[2rem] border border-white/5 hover:bg-sky-600 hover:scale-105 transition-all group text-center flex flex-col items-center gap-2">
            <Icon className="w-6 h-6 text-sky-400 group-hover:text-white" />
            <span className="text-[11px] font-black text-white/80 group-hover:text-white uppercase tracking-[0.1em]">{label}</span>
        </Link>
    );
}
