'use client';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ShieldCheck, Star } from 'lucide-react';

export default function CertificateGenerator({ userName, courseName }: { userName: string, courseName: string }) {
    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        const text = encodeURIComponent(`I just completed the ${courseName} course on SkillForge! 🚀 #Learning #SkillForge #Certification`);
        const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
        window.open(linkedinUrl, '_blank');
    };

    return (
        <div className="space-y-12 py-12">
            <div className="max-w-4xl mx-auto bg-white border-[20px] border-slate-100 p-16 relative overflow-hidden shadow-2xl print:border-none print:shadow-none print:block" id="certificate">
                {/* Background watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                    <Award className="w-96 h-96 text-sky-900" />
                </div>

                <div className="relative z-10 text-center space-y-8">
                    <div className="flex justify-center mb-12">
                        <div className="w-20 h-20 bg-sky-600 rounded-2xl flex items-center justify-center rotate-12">
                            <span className="text-white font-black text-3xl italic">SF</span>
                        </div>
                    </div>

                    <h1 className="text-sm font-black uppercase tracking-[0.3em] text-sky-600">Certificate of Completion</h1>
                    <p className="text-slate-500 font-medium">This is to certify that</p>

                    <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic border-b-2 border-slate-900 inline-block px-12 pb-2">
                        {userName}
                    </h2>

                    <p className="text-slate-500 font-medium">has successfully completed the course</p>

                    <h3 className="text-3xl font-black text-sky-600 uppercase tracking-tight">
                        {courseName}
                    </h3>

                    <div className="pt-16 grid grid-cols-3 gap-8 border-t border-slate-100">
                        <div className="text-center">
                            <p className="text-slate-900 font-bold border-b border-slate-300 pb-2">SkillForge Team</p>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Issuer</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <ShieldCheck className="w-12 h-12 text-sky-600 opacity-50" />
                        </div>
                        <div className="text-center">
                            <p className="text-slate-900 font-bold border-b border-slate-300 pb-2">{new Date().toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">Date Awarded</p>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 text-[8px] text-slate-300 font-black uppercase tracking-widest">
                        SF-VERIFIED-CERTIFICATE-{Math.random().toString(36).substring(7).toUpperCase()}
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 print:hidden">
                <button onClick={handlePrint} className="btn-primary flex items-center gap-2 px-10">
                    <Download className="w-5 h-5" /> Download PDF
                </button>
                <button onClick={handleShare} className="px-10 py-3 border-2 border-slate-900 rounded-xl font-black flex items-center gap-2 hover:bg-slate-50 transition-colors">
                    <Share2 className="w-5 h-5" /> Share to LinkedIn
                </button>
            </div>
        </div>
    );
}
