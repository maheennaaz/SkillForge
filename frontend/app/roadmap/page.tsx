'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronRight, BookOpen, Trophy, Zap } from 'lucide-react';

const ROADMAPS = {
    'Data Analytics': {
        icon: <Zap className="w-5 h-5 text-blue-600" />,
        levels: [
            {
                name: 'Beginner Level',
                skills: ['Python Basics', 'Data Types', 'Control Flow']
            },
            {
                name: 'Intermediate Level',
                skills: ['Pandas', 'Data Cleaning', 'Data Visualization']
            },
            {
                name: 'Advanced Level',
                skills: ['Machine Learning', 'Model Evaluation', 'Data Projects']
            }
        ]
    },
    'Artificial Intelligence': {
        icon: <BookOpen className="w-5 h-5 text-purple-600" />,
        levels: [
            {
                name: 'Beginner Level',
                skills: ['Linear Algebra', 'Calculus Basics', 'Python for AI']
            },
            {
                name: 'Intermediate Level',
                skills: ['Neural Networks', 'Natural Language Processing', 'Computer Vision']
            },
            {
                name: 'Advanced Level',
                skills: ['Reinforcement Learning', 'GANs', 'AI Ethics']
            }
        ]
    },
    'Java Development': {
        icon: <Trophy className="w-5 h-5 text-orange-600" />,
        levels: [
            {
                name: 'Beginner Level',
                skills: ['Java Syntax', 'Variables & Operators', 'Conditional Logic']
            },
            {
                name: 'Intermediate Level',
                skills: ['OOP Principles', 'Collections Framework', 'Exception Handling']
            },
            {
                name: 'Advanced Level',
                skills: ['Multithreading', 'Streams API', 'Spring Boot Basics']
            }
        ]
    }
};

export default function RoadmapPage() {
    const [completedSkills, setCompletedSkills] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('Data Analytics');

    useEffect(() => {
        const saved = localStorage.getItem('skillforge_roadmap_progress');
        if (saved) setCompletedSkills(JSON.parse(saved));
    }, []);

    const toggleSkill = (skill: string) => {
        const newSet = completedSkills.includes(skill)
            ? completedSkills.filter(s => s !== skill)
            : [...completedSkills, skill];
        setCompletedSkills(newSet);
        localStorage.setItem('skillforge_roadmap_progress', JSON.stringify(newSet));
    };

    const totalSkills = Object.values(ROADMAPS).reduce((acc, roadmap) =>
        acc + roadmap.levels.reduce((lAcc, level) => lAcc + level.skills.length, 0), 0);

    const progress = Math.round((completedSkills.length / totalSkills) * 100);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Learning Roadmap</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Master your career path step-by-step. Track your progress across our curated skill paths.
                    </p>
                </div>

                {/* Progress Bar Container */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 sticky top-24 z-10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Overall Progress</span>
                        <span className="text-lg font-black text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-blue-600 h-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                        />
                    </div>
                </div>

                {/* Roadmap Selection Tabs */}
                <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {Object.keys(ROADMAPS).map((name) => (
                        <button
                            key={name}
                            onClick={() => setActiveTab(name)}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === name
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {ROADMAPS[name as keyof typeof ROADMAPS].icon}
                            {name}
                        </button>
                    ))}
                </div>

                {/* Vertical Roadmap Timeline */}
                <div className="space-y-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {ROADMAPS[activeTab as keyof typeof ROADMAPS].levels.map((level, lIndex) => (
                                <div key={level.name} className="relative pl-8 sm:pl-12">
                                    {/* Timeline Line */}
                                    {lIndex !== ROADMAPS[activeTab as keyof typeof ROADMAPS].levels.length - 1 && (
                                        <div className="absolute left-4 sm:left-6 top-8 bottom-[-32px] w-0.5 bg-slate-200" />
                                    )}

                                    {/* Level Indicator */}
                                    <div className="absolute left-0 top-0 w-8 sm:w-12 h-8 sm:h-12 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center z-10 shadow-sm">
                                        <span className="text-xs font-black text-slate-900">{lIndex + 1}</span>
                                    </div>

                                    {/* Content Card */}
                                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                            {level.name}
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {level.skills.map((skill) => (
                                                <button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${completedSkills.includes(skill)
                                                            ? 'bg-blue-50 border-blue-200 text-blue-900 ring-2 ring-blue-500/10'
                                                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                                                        }`}
                                                >
                                                    <div className="shrink-0">
                                                        {completedSkills.includes(skill)
                                                            ? <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-50" />
                                                            : <Circle className="w-6 h-6 text-slate-300" />
                                                        }
                                                    </div>
                                                    <span className={`font-bold text-sm ${completedSkills.includes(skill) ? 'line-through opacity-75' : ''}`}>
                                                        {skill}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
