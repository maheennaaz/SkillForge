'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { ChevronDown, ChevronUp, Play, CheckCircle2, Lock, Layout, Home, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubjectSidebar() {
    const { subjectId, videoId } = useParams();
    const [tree, setTree] = useState<any>(null);
    const [expandedSections, setExpandedSections] = useState<number[]>([]);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const { data } = await apiClient.get(`/subjects/${subjectId}/tree`);
                setTree(data);
                // Expand the current section by default
                const currentSection = data.sections.find((s: any) =>
                    s.videos.some((v: any) => v.id.toString() === videoId)
                );
                if (currentSection) setExpandedSections([currentSection.id]);
            } catch (err) {
                console.error('Failed to fetch subject tree', err);
            }
        };
        if (subjectId) fetchTree();
    }, [subjectId, videoId]);

    const toggleSection = (id: number) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    if (!tree) return <div className="p-8"><div className="w-full h-8 bg-slate-100 animate-pulse rounded-lg" /></div>;

    return (
        <div className="h-full flex flex-col bg-white border-r border-slate-200">
            <div className="p-6 border-b border-slate-100 space-y-4">
                <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-sky-600 font-bold text-sm group transition-colors">
                    <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    Back to Home
                </Link>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{tree.title}</h2>
                <div className="flex items-center gap-2">
                    <div className="flex-grow bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-sky-500 h-full transition-all duration-1000"
                            style={{ width: `${tree.progress_percent || 0}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">{tree.progress_percent || 0}%</span>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-2">
                {tree.sections.map((section: any) => (
                    <div key={section.id} className="space-y-1">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${expandedSections.includes(section.id) ? 'bg-sky-50 text-sky-900' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${expandedSections.includes(section.id) ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {section.order_index}
                                </div>
                                <span className="font-bold text-sm tracking-tight">{section.title}</span>
                            </div>
                            {expandedSections.includes(section.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <AnimatePresence>
                            {expandedSections.includes(section.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-1 pl-4 pr-2"
                                >
                                    {section.videos.map((video: any) => (
                                        <Link
                                            key={video.id}
                                            href={`/subjects/${subjectId}/video/${video.id}`}
                                            className={`flex items-center justify-between p-3 rounded-xl transition-all group ${videoId === video.id.toString()
                                                ? 'bg-white border-2 border-sky-500 shadow-sm'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 shrink-0">
                                                {video.is_completed ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                                ) : (
                                                    <Play className={`w-4 h-4 shrink-0 ${videoId === video.id.toString() ? 'text-sky-600' : 'text-slate-300 group-hover:text-sky-400'}`} />
                                                )}
                                                <span className={`text-xs font-bold leading-tight ${videoId === video.id.toString() ? 'text-slate-900' : 'text-slate-500'}`}>
                                                    {video.title}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-300">
                                                {Math.floor(video.duration_seconds / 60)}m
                                            </span>
                                        </Link>
                                    ))}

                                    {/* Chapter Assessment Link */}
                                    <div className="p-3 border-t border-sky-100/50 mt-2">
                                        <button
                                            onClick={() => {
                                                window.dispatchEvent(new CustomEvent('show-assessment', { detail: { sectionId: section.id } }));
                                            }}
                                            className="w-full bg-slate-900 text-white p-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-colors"
                                        >
                                            <FileText className="w-4 h-4" /> Assessment
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
