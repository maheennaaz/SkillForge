'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { CheckCircle2, XCircle, ChevronRight, Trophy, RefreshCw, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Assessment({ sectionId, onComplete }: { sectionId: number, onComplete: () => void }) {
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<any>({});
    const [result, setResult] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            setLoading(true);
            setQuiz(null);
            setResult(null);
            setAnswers({});
            try {
                const { data } = await apiClient.get(`/assessments/section/${sectionId}`);
                setQuiz(data);
            } catch (err) {
                console.error('Quiz not found', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [sectionId]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const { data } = await apiClient.post('/assessments/submit', {
                quizId: quiz.id,
                answers
            });
            setResult(data);
            if (data.passed) onComplete();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto" />;
    if (!quiz) return null;

    if (result) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative space-y-8 py-12">
                <button
                    onClick={onComplete}
                    className="absolute top-4 right-0 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                    title="Close Assessment"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="card text-center p-12 space-y-6 bg-white shadow-xl rounded-[3rem]">
                    {result.passed ? (
                        <>
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <Trophy className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">Chapter Mastered!</h2>
                            <p className="text-slate-500">You scored {result.score}%. You've successfully forged your knowledge.</p>
                            <button onClick={onComplete} className="btn-primary flex items-center gap-2 mx-auto bg-slate-900 hover:bg-slate-800">
                                <XCircle className="w-4 h-4" /> Close Assessment
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                <XCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">Keep Reforging!</h2>
                            <p className="text-slate-500">You scored {result.score}%. A score of 70% is required to pass.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button onClick={() => setResult(null)} className="btn-primary flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" /> Try Again
                                </button>
                                <button onClick={onComplete} className="text-slate-500 font-bold hover:text-slate-900 transition-colors">
                                    Close Assessment
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 px-4">Review Your Answers</h3>
                    {result.feedback.map((f: any, idx: number) => (
                        <div key={f.questionId} className={`card border-2 p-8 space-y-4 ${f.isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                            <div className="flex items-start justify-between gap-4">
                                <h4 className="font-bold text-slate-900">{idx + 1}. {f.questionText}</h4>
                                {f.isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> : <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                                <div className={`p-4 rounded-xl border-2 ${f.isCorrect ? 'border-green-200 bg-green-100/50 text-green-800' : 'border-red-200 bg-red-100/50 text-red-800'}`}>
                                    <span className="opacity-60 block text-[10px] uppercase font-black mb-1">Your Answer</span>
                                    {f.userAnswer}
                                </div>
                                {!f.isCorrect && (
                                    <div className="p-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800">
                                        <span className="opacity-60 block text-[10px] uppercase font-black mb-1">Correct Answer</span>
                                        {f.correctOption}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative space-y-8 max-w-2xl mx-auto py-12">
            <button
                onClick={onComplete}
                className="absolute top-4 right-0 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                title="Close Assessment"
            >
                <X className="w-6 h-6" />
            </button>
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">{quiz.title}</h2>
                <p className="text-slate-500 font-medium tracking-tight">Prove your skills before moving to the next chapter.</p>
            </div>

            <div className="space-y-6">
                {quiz.questions.map((q: any, idx: number) => (
                    <div key={q.id} className="card bg-white border-2 border-slate-100 p-8 space-y-6">
                        <h4 className="text-lg font-bold text-slate-900">{idx + 1}. {q.question_text}</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {['a', 'b', 'c', 'd'].map((optionKey) => (
                                <button
                                    key={optionKey}
                                    onClick={() => setAnswers({ ...answers, [q.id]: optionKey.toUpperCase() })}
                                    className={`p-4 rounded-xl border-2 text-left font-medium transition-all flex items-center justify-between ${answers[q.id] === optionKey.toUpperCase()
                                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                        }`}
                                >
                                    <span>{q[`option_${optionKey}`]}</span>
                                    {answers[q.id] === optionKey.toUpperCase() && <CheckCircle2 className="w-5 h-5" />}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions.length || submitting}
                className="w-full btn-primary py-4 text-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
                {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Submit Assessment'}
            </button>
        </div>
    );
}
