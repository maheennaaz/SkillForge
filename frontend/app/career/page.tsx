'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    MessageSquare,
    CheckSquare,
    Lightbulb,
    RefreshCw,
    Download,
    User,
    Briefcase,
    GraduationCap,
    Code2,
    CheckCircle2,
    Circle
} from 'lucide-react';

const INTERVIEW_QUESTIONS = [
    { type: 'Technical', q: "Explain the difference between '==' and '.equals()' in Java." },
    { type: 'Technical', q: "What are the common data cleaning techniques in Pandas?" },
    { type: 'Technical', q: "Explain the concept of Overfitting in Machine Learning." },
    { type: 'HR', q: "Where do you see yourself in 5 years?" },
    { type: 'HR', q: "Tell me about a time you handled a difficult situation." },
    { type: 'Technical', q: "What is the difference between supervised and unsupervised learning?" },
    { type: 'Technical', q: "What are the key features of OOPs?" },
    { type: 'HR', q: "Why should we hire you?" }
];

const READINESS_ITEMS = [
    "Professional Resume Prepared",
    "Completed at least 2 major Projects",
    "Practiced 50+ Coding Problems",
    "Mock Interview Preparation Done",
    "LinkedIn Profile Optimized",
    "GitHub Portfolio Updated"
];

export default function CareerSupportPage() {
    const [resumeData, setResumeData] = useState({
        name: '',
        subtitle: '',
        email: '',
        phone: '',
        summary: '',
        education: '',
        skills: '',
        experience: '',
        projects: '',
        hobbies: ''
    });
    const [currentQuestion, setCurrentQuestion] = useState(INTERVIEW_QUESTIONS[0]);
    const [readiness, setReadiness] = useState<string[]>([]);
    const [activeSection, setActiveSection] = useState('resume');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeTip, setActiveTip] = useState<string | null>(null);

    const handleDownload = () => {
        window.print();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const toggleReadiness = (item: string) => {
        setReadiness(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const getRandomQuestion = () => {
        const others = INTERVIEW_QUESTIONS.filter(q => q.q !== currentQuestion.q);
        setCurrentQuestion(others[Math.floor(Math.random() * others.length)]);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-slate-900 py-16 text-white text-center sm:text-left overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -mr-48 -mt-48" />
                <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter">Career Support</h1>
                        <p className="text-slate-400 max-w-xl text-lg">
                            Your bridge from learning to earning. Build your resume, practice interviews, and track your placement readiness.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-blue-600/20 p-6 rounded-3xl border border-blue-500/30">
                            <span className="block text-3xl font-black text-blue-400">
                                {Math.round((readiness.length / READINESS_ITEMS.length) * 100)}%
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Readiness Score</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="lg:col-span-3 space-y-2">
                        {[
                            { id: 'resume', label: 'Resume Builder', icon: FileText },
                            { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
                            { id: 'readiness', label: 'Readiness Tracker', icon: CheckSquare },
                            { id: 'tips', label: 'Career Tips', icon: Lightbulb }
                        ].map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${activeSection === section.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <section.icon className="w-5 h-5" />
                                {section.label}
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {/* Resume Builder */}
                            {activeSection === 'resume' && (
                                <motion.div
                                    key="resume"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block"
                                >
                                    <div className="space-y-6 print:hidden">
                                        <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-4">
                                            <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                                <User className="w-5 h-5 text-blue-600" /> Professional Details
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Full Name"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                                                    onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                                                    required
                                                />
                                                <input
                                                    placeholder="Email Address"
                                                    type="email"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                                                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    placeholder="Phone Number"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                                                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                                                />
                                                <input
                                                    placeholder="Title (e.g. Data Analyst)"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                                                    onChange={(e) => setResumeData({ ...resumeData, subtitle: e.target.value })}
                                                />
                                            </div>

                                            <textarea
                                                placeholder="Professional Summary (ATS Tip: Mention your career goals and top skills)"
                                                rows={3}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-sm"
                                                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                                            />

                                            <textarea
                                                placeholder="Experience (Company, Role, Dates, Achievements)"
                                                rows={4}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-sm"
                                                onChange={(e) => setResumeData({ ...resumeData, experience: e.target.value })}
                                            />

                                            <textarea
                                                placeholder="Education (e.g. B.Tech in CS, 2024)"
                                                rows={2}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-sm"
                                                onChange={(e) => setResumeData({ ...resumeData, education: e.target.value })}
                                            />
                                            <textarea
                                                placeholder="Skills (Comma separated)"
                                                rows={2}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-sm"
                                                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                                            />
                                            <textarea
                                                placeholder="Recent Projects"
                                                rows={3}
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none text-sm"
                                                onChange={(e) => setResumeData({ ...resumeData, projects: e.target.value })}
                                            />
                                            <input
                                                placeholder="Hobbies/Interests"
                                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                                                onChange={(e) => setResumeData({ ...resumeData, hobbies: e.target.value })}
                                            />

                                            <div className="flex gap-4 pt-4">
                                                <button
                                                    type="submit"
                                                    className="flex-grow bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                                >
                                                    {isSubmitted ? 'Details Saved!' : 'Submit Details'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleDownload}
                                                    className="px-6 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all active:scale-95"
                                                    title="Download as PDF"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    {/* Preview - ATS FRIENDLY STYLE */}
                                    <div className="bg-slate-100 rounded-3xl p-1 shadow-2xl overflow-hidden min-h-[700px] border-2 border-slate-200 print:p-0 print:m-0 print:border-0 print:shadow-none print:bg-white print:w-full">
                                        <div className="bg-white h-full rounded-[20px] p-10 shadow-inner overflow-y-auto print:rounded-none print:shadow-none print:p-0">
                                            {/* Header */}
                                            <div className="border-b-2 border-black pb-4 mb-6 text-center">
                                                <h2 className="text-3xl font-black text-black tracking-tight uppercase print:text-2xl">{resumeData.name || 'YOUR NAME'}</h2>
                                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-sm text-black">
                                                    {resumeData.email && <span className="text-blue-600 underline">{resumeData.email}</span>}
                                                    {resumeData.phone && <span>{resumeData.phone}</span>}
                                                    {resumeData.subtitle && <span className="font-bold">{resumeData.subtitle}</span>}
                                                </div>
                                            </div>

                                            <div className="space-y-6 text-black">
                                                {/* Summary */}
                                                {resumeData.summary && (
                                                    <section>
                                                        <h4 className="border-b border-black text-sm font-black uppercase tracking-wider mb-2">Professional Summary</h4>
                                                        <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                                                    </section>
                                                )}

                                                {/* Experience */}
                                                <section>
                                                    <h4 className="border-b border-black text-sm font-black uppercase tracking-wider mb-2">Work Experience</h4>
                                                    <div className="text-sm whitespace-pre-wrap">{resumeData.experience || 'Experience details will appear here...'}</div>
                                                </section>

                                                {/* Education */}
                                                <section>
                                                    <h4 className="border-b border-black text-sm font-black uppercase tracking-wider mb-2">Education</h4>
                                                    <p className="text-sm whitespace-pre-wrap">{resumeData.education || 'Highest qualification...'}</p>
                                                </section>

                                                {/* Projects */}
                                                <section>
                                                    <h4 className="border-b border-black text-sm font-black uppercase tracking-wider mb-2">Recent Projects</h4>
                                                    <p className="text-sm italic whitespace-pre-wrap">{resumeData.projects}</p>
                                                </section>

                                                {/* Skills */}
                                                <section>
                                                    <h4 className="border-b border-black text-sm font-black uppercase tracking-wider mb-2">Technical Skills</h4>
                                                    <p className="text-sm font-medium">{resumeData.skills}</p>
                                                </section>

                                                {/* Hobbies */}
                                                {resumeData.hobbies && (
                                                    <section>
                                                        <h4 className="border-b border-black text-sm font-black uppercase tracking-wider mb-2">Interests & Hobbies</h4>
                                                        <p className="text-sm">{resumeData.hobbies}</p>
                                                    </section>
                                                )}
                                            </div>

                                            {/* ATS Footer Disclaimer (Hidden in print) */}
                                            <div className="mt-12 pt-8 border-t border-slate-100 text-center print:hidden">
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Generated by SkillForge ATS Builder</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Interview Prep */}
                            {activeSection === 'interview' && (
                                <motion.div
                                    key="interview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="max-w-2xl mx-auto"
                                >
                                    <div className="bg-blue-600 rounded-3xl p-12 text-white text-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -ml-16 -mt-16" />
                                        <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                            {currentQuestion.type} Question
                                        </span>
                                        <h3 className="text-3xl font-black mb-12 italic leading-tight">
                                            "{currentQuestion.q}"
                                        </h3>
                                        <button
                                            onClick={getRandomQuestion}
                                            className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            Next
                                        </button>
                                    </div>

                                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setActiveTip(activeTip === 'star' ? null : 'star')}
                                            className={`p-6 rounded-3xl text-left transition-all ${activeTip === 'star' ? 'bg-slate-900 text-white ring-4 ring-blue-500/20' : 'bg-slate-100 hover:bg-slate-200'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${activeTip === 'star' ? 'bg-blue-600' : 'bg-white'}`}>
                                                <Briefcase className={`w-5 h-5 ${activeTip === 'star' ? 'text-white' : 'text-slate-400'}`} />
                                            </div>
                                            <h4 className="font-bold mb-1">STAR Method</h4>
                                            <p className="text-xs opacity-70 mb-4">Focus on your HR and behavioral answers.</p>
                                            <AnimatePresence>
                                                {activeTip === 'star' && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        className="space-y-2 text-[10px] uppercase tracking-tighter font-black"
                                                    >
                                                        <div className="flex gap-2">
                                                            <span className="text-blue-400">S:</span> Situation - Set the scene
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-blue-400">T:</span> Task - What needed doing?
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-blue-400">A:</span> Action - What did YOU do?
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-blue-400">R:</span> Result - What was the outcome?
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>

                                        <button
                                            onClick={() => setActiveTip(activeTip === 'complexity' ? null : 'complexity')}
                                            className={`p-6 rounded-3xl text-left transition-all ${activeTip === 'complexity' ? 'bg-slate-900 text-white ring-4 ring-indigo-500/20' : 'bg-slate-100 hover:bg-slate-200'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${activeTip === 'complexity' ? 'bg-indigo-600' : 'bg-white'}`}>
                                                <Code2 className={`w-5 h-5 ${activeTip === 'complexity' ? 'text-white' : 'text-slate-400'}`} />
                                            </div>
                                            <h4 className="font-bold mb-1">Big O Notation</h4>
                                            <p className="text-xs opacity-70 mb-4">Crucial for all technical coding rounds.</p>
                                            <AnimatePresence>
                                                {activeTip === 'complexity' && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        className="space-y-2 text-[10px] uppercase tracking-tighter font-black"
                                                    >
                                                        <div className="flex gap-2">
                                                            <span className="text-indigo-400">O(1):</span> Constant Time
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-indigo-400">O(log n):</span> Binary Search
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-indigo-400">O(n):</span> Iterating a list
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-indigo-400">O(n²):</span> Nested loops
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Readiness Tracker */}
                            {activeSection === 'readiness' && (
                                <motion.div key="readiness" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-4">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8">Placement Readiness Tracker</h3>
                                    {READINESS_ITEMS.map(item => (
                                        <button
                                            key={item}
                                            onClick={() => toggleReadiness(item)}
                                            className={`w-full flex items-center gap-4 p-6 rounded-2xl border transition-all text-left ${readiness.includes(item)
                                                ? 'bg-green-50 border-green-200 text-green-900'
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                                                }`}
                                        >
                                            {readiness.includes(item)
                                                ? <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                : <Circle className="w-6 h-6 text-slate-300" />
                                            }
                                            <span className="font-bold">{item}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            {/* Career Tips */}
                            {activeSection === 'tips' && (
                                <motion.div key="tips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { title: "Strong Projects", text: "Focus on real-world problem solving. Deploy your projects on Vercel or GitHub." },
                                        { title: "LinkedIn Branding", text: "Keep your profile up to date with a professional headshot and clear summary." },
                                        { title: "Open Source", text: "Contribute to open source projects to show collaboration skills." },
                                        { title: "Continuous Learning", text: "Technologies change fast. Stay updated with the latest library versions." }
                                    ].map(tip => (
                                        <div key={tip.title} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                <Lightbulb className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 mb-2">{tip.title}</h4>
                                            <p className="text-slate-500 leading-relaxed text-sm">{tip.text}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
