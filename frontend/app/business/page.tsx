'use client';
import { ShieldCheck, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BusinessPage() {
    return (
        <div className="space-y-24 py-24">
            <section className="bg-slate-900 rounded-[3rem] p-16 text-center text-white space-y-8">
                <h1 className="text-5xl font-black tracking-tight">SkillForge for Business</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">Empower your team with the world's most advanced learning platform.</p>
                <button className="btn-primary px-12 py-4 text-lg">Contact Sales</button>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                <div className="card text-center space-y-4">
                    <ShieldCheck className="w-12 h-12 text-sky-600 mx-auto" />
                    <h3 className="text-xl font-bold font-black">Secure Learning</h3>
                    <p className="text-slate-500">Industry-standard security for your corporate data.</p>
                </div>
                <div className="card text-center space-y-4">
                    <Users className="w-12 h-12 text-sky-600 mx-auto" />
                    <h3 className="text-xl font-bold font-black">Team Analytics</h3>
                    <p className="text-slate-500">Track progress and ROI across your organization.</p>
                </div>
                <div className="card text-center space-y-4">
                    <TrendingUp className="w-12 h-12 text-sky-600 mx-auto" />
                    <h3 className="text-xl font-bold font-black">Upskill Faster</h3>
                    <p className="text-slate-500">Forge the skills your business needs to stay ahead.</p>
                </div>
            </div>
        </div>
    );
}
