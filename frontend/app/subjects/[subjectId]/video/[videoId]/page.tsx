'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import YouTube from 'react-youtube';
import apiClient from '@/lib/apiClient';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Assessment from '@/components/Assessment';
import CertificateGenerator from '@/components/Certificates/CertificateGenerator';
import { useAuthStore } from '@/store/authStore';

export default function VideoPage() {
    const { subjectId, videoId } = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const [video, setVideo] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [tree, setTree] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [assessmentSectionId, setAssessmentSectionId] = useState<number | null>(null);
    const [isCourseComplete, setIsCourseComplete] = useState(false);
    const playerRef = useRef<any>(null);
    const saveInterval = useRef<any>(null);

    useEffect(() => {
        const handleShow = (e: any) => {
            if (e.detail.sectionId) setAssessmentSectionId(e.detail.sectionId);
        };
        window.addEventListener('show-assessment', handleShow);
        return () => window.removeEventListener('show-assessment', handleShow);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true); // Set loading to true before fetching
            const [vRes, pRes, tRes] = await Promise.all([
                apiClient.get(`/videos/${videoId}`),
                apiClient.get(`/progress/videos/${videoId}`),
                apiClient.get(`/subjects/${subjectId}/tree`)
            ]);
            setVideo(vRes.data);
            setProgress(pRes.data);
            setTree(tRes.data);

            // Strict check for course completion
            const allCompleted = tRes.data.sections.every((s: any) =>
                s.videos.length > 0 && s.videos.every((v: any) => v.is_completed)
            );
            setIsCourseComplete(allCompleted);

        } catch (err) {
            console.error('Failed to fetch video data', err);
        } finally {
            setLoading(false);
        }
    }, [videoId, subjectId]); // Dependencies for useCallback

    useEffect(() => {
        if (videoId) fetchData();

        return () => {
            if (saveInterval.current) clearInterval(saveInterval.current);
        };
    }, [videoId, subjectId, fetchData]); // Add fetchData to dependencies

    const saveProgress = async (currentTime: number, completed: boolean = false) => {
        try {
            await apiClient.post(`/progress/videos/${videoId}`, {
                last_position_seconds: Math.floor(currentTime),
                is_completed: completed
            });
            if (completed) {
                setProgress((prev: any) => ({ ...prev, is_completed: true }));
                // If this was the last video in section, show assessment
                setAssessmentSectionId(video.section_id);
                // RE-FETCH completion status
                fetchData();
            }
        } catch (err) {
            console.error('Failed to save progress', err);
        }
    };

    // Lesson Navigation logic
    const getFlatLessons = () => {
        if (!tree) return [];
        return tree.sections.flatMap((s: any) => s.videos);
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
        </div>
    );

    const ytId = getYouTubeId(video?.youtube_url || '');
    const flatLessons = tree?.sections.flatMap((s: any) => s.videos) || [];
    const currentIndex = flatLessons.findIndex((l: any) => l.id.toString() === videoId);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
            {/* Assessment Overlay */}
            <AnimatePresence>
                {assessmentSectionId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    >
                        <div className="w-full max-w-3xl relative">
                            <button
                                onClick={() => setAssessmentSectionId(null)}
                                className="absolute -top-12 right-0 text-white font-black hover:text-sky-400 transition-colors"
                            >
                                Close Assessment
                            </button>
                            <div className="bg-white rounded-[3rem] p-1 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                <Assessment sectionId={assessmentSectionId} onComplete={() => setAssessmentSectionId(null)} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Container */}
            <div className="aspect-video w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
                {ytId ? (
                    <YouTube
                        key={ytId}
                        videoId={ytId}
                        onReady={(e) => {
                            playerRef.current = e.target;
                            if (progress?.last_position_seconds > 0 && !progress.is_completed) e.target.seekTo(progress.last_position_seconds);
                        }}
                        onPlay={() => {
                            saveInterval.current = setInterval(() => {
                                if (playerRef.current) saveProgress(playerRef.current.getCurrentTime());
                            }, 5000);
                        }}
                        onPause={() => {
                            if (saveInterval.current) clearInterval(saveInterval.current);
                            if (playerRef.current) saveProgress(playerRef.current.getCurrentTime());
                        }}
                        onEnd={() => {
                            if (saveInterval.current) clearInterval(saveInterval.current);
                            if (playerRef.current) saveProgress(playerRef.current.getDuration(), true);
                        }}
                        opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: { autoplay: 0, rel: 0, modestbranding: 1 }
                        }}
                        className="w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">Invalid Video URL</div>
                )}
            </div>

            {/* Hero Info */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-widest">
                        <span className="bg-sky-50 px-2 py-1 rounded">{video.subject_title}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">{video.section_title}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{video.title}</h1>
                    <div className="flex items-center space-x-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {Math.floor(video.duration_seconds / 60)} mins</span>
                        {progress?.is_completed && (
                            <span className="flex items-center space-x-1 text-green-600 font-bold animate-pulse">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>COMPLETED</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push(`/subjects/${subjectId}/video/${flatLessons[currentIndex - 1].id}`)}
                        disabled={currentIndex === 0}
                        className="flex items-center space-x-2 px-6 py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Prev</span>
                    </button>
                    <button
                        onClick={() => router.push(`/subjects/${subjectId}/video/${flatLessons[currentIndex + 1].id}`)}
                        disabled={currentIndex === flatLessons.length - 1}
                        className="btn-primary flex items-center space-x-2 px-8 py-3"
                    >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Course & Lesson Descriptions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-sky-600" />
                            Lesson Description
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {video.description || "In this lesson, we'll dive deep into the core concepts of " + video.title + ". This content is designed to help you build practical skills through hands-on learning."}
                        </p>
                    </section>

                    <section className="p-8 bg-sky-50 rounded-3xl border border-sky-100 space-y-4">
                        <h3 className="text-xl font-bold text-sky-900">About this course</h3>
                        <p className="text-sky-800/80 leading-relaxed">
                            {tree?.description || "Master the concepts of this subject with high-quality video content and structured learning paths meticulously forged for your success."}
                        </p>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="card border-none bg-slate-900 text-white p-8 overflow-hidden relative">
                        <div className="relative z-10">
                            <h4 className="text-lg font-bold mb-4">Forge Your Future</h4>
                            <p className="text-slate-400 text-sm mb-6">Complete all lessons to unlock your verified SkillForge Certificate of Excellence.</p>
                            <button
                                disabled={!isCourseComplete}
                                onClick={() => {
                                    const el = document.getElementById('certificate-section');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${isCourseComplete ? 'bg-sky-500 hover:bg-sky-400 text-slate-900 shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                            >
                                {isCourseComplete ? 'Claim Your Certificate' : 'Complete Course to Unlock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Section */}
            {isCourseComplete && (
                <section id="certificate-section" className="pt-24 border-t border-slate-200">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-4xl font-black text-slate-900">Congratulations, {user?.name}!</h2>
                        <p className="text-slate-500">You have successfully forged your skills in <b>{video.subject_title}</b>.</p>
                    </div>
                    <CertificateGenerator userName={user?.name || ''} courseName={video.subject_title} />
                </section>
            )}
        </motion.div>
    );
}
