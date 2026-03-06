'use client';
import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import Sidebar from '@/components/Sidebar/SubjectSidebar';
import { Loader2 } from 'lucide-react';

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
    const { subjectId } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const { data } = await apiClient.get(`/subjects/${subjectId}/tree`);
                setData(data);
            } catch (err: any) {
                console.error('Failed to fetch tree', err);
                setError(err.response?.data || { error: err.message });
            } finally {
                setLoading(false);
            }
        };
        if (subjectId) fetchTree();
    }, [subjectId]);

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-red-50 rounded-3xl border-2 border-red-100 max-w-2xl mx-auto my-12">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                    <Layout className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-red-900 mb-2">Subject Load Error</h2>
                <p className="text-red-700 font-medium mb-6 text-center">{error.error || 'Unknown error occurred while loading course content.'}</p>
                {error.stack && (
                    <pre className="w-full bg-slate-900 text-slate-400 p-4 rounded-xl text-[10px] overflow-x-auto mb-6 whitespace-pre-wrap leading-relaxed max-h-48">
                        {error.stack}
                    </pre>
                )}
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden gap-8">
            <aside className="w-80 flex-shrink-0 overflow-y-auto pr-4 border-r border-slate-200 dark:border-slate-800">
                <Sidebar sections={data?.sections || []} subjectId={subjectId as string} />
            </aside>
            <main className="flex-grow overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
