'use client';
import { Award, BookOpen, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TeachPage() {
    return (
        <div className="space-y-24 py-24">
            <section className="bg-sky-600 rounded-[3rem] p-16 text-center text-white space-y-8">
                <h1 className="text-5xl font-black tracking-tight">Teach on SkillForge</h1>
                <p className="text-xl text-sky-100 max-w-2xl mx-auto">Share your expertise and help others forge their future.</p>
                <button className="bg-white text-sky-600 font-black px-12 py-4 rounded-2xl text-lg hover:bg-sky-50 transition-all">Get Started</button>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                <div className="card text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-sky-600 mx-auto" />
                    <h3 className="text-xl font-bold font-black">Plan Your Course</h3>
                    <p className="text-slate-500">Use our premium tools to structure your curriculum.</p>
                </div>
                <div className="card text-center space-y-4">
                    <Award className="w-12 h-12 text-sky-600 mx-auto" />
                    <h3 className="text-xl font-bold font-black">Build Your Brand</h3>
                    <p className="text-slate-500">Reach thousands of students globally.</p>
                </div>
                <div className="card text-center space-y-4">
                    <DollarSign className="w-12 h-12 text-sky-600 mx-auto" />
                    <h3 className="text-xl font-bold font-black">Earn Revenue</h3>
                    <p className="text-slate-500">Get paid for every student who joins your course.</p>
                </div>
            </div>
        </div>
    );
}
