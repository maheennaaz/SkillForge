'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { User as UserIcon, Mail, Calendar, UserCheck, Briefcase, Save, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        skills: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await apiClient.get('/users/profile');
                setFormData({
                    name: data.name || '',
                    dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
                    gender: data.gender || '',
                    skills: data.skills || ''
                });
                setUser(data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [setUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await apiClient.put('/users/profile', formData);
            setUser({ ...user!, ...formData });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update profile', err);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-sky-600" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
            <header className="space-y-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Profile</h1>
                <p className="text-slate-500 text-lg">Manage your personal information and skills to personalize your Forge experience.</p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Side: Avatar & Basic Info */}
                <div className="card h-fit space-y-8 bg-slate-900 text-white p-8">
                    <div className="w-24 h-24 bg-sky-500 rounded-full flex items-center justify-center mx-auto text-4xl font-black text-slate-900">
                        {formData.name[0]?.toUpperCase()}
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</span>
                            <div className="flex items-center gap-2 text-slate-100">
                                <Mail className="w-4 h-4 text-sky-400" />
                                <span className="font-medium truncate">{user?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Edit Form */}
                <div className="md:col-span-2 space-y-8">
                    <div className="card space-y-8 p-8 border-2 border-slate-100">
                        <section className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-sky-600" />
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 outline-none p-3 rounded-xl font-medium transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 outline-none p-3 pl-10 rounded-xl font-medium transition-all"
                                            value={formData.dob}
                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Gender</label>
                                    <div className="relative">
                                        <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select
                                            className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 outline-none p-3 pl-10 rounded-xl font-medium transition-all appearance-none"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6 pt-6 border-t border-slate-100">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-sky-600" />
                                Your Skills
                            </h3>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Skills (Comma separated)</label>
                                <textarea
                                    placeholder="e.g. Python, Data Analysis, React, Java..."
                                    className="w-full bg-slate-50 border-2 border-transparent focus:border-sky-500 outline-none p-4 rounded-xl font-medium transition-all min-h-[120px]"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                />
                            </div>
                        </section>

                        <div className="flex items-center justify-between pt-6">
                            {message && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-green-600 font-bold text-sm">
                                    <CheckCircle className="w-4 h-4" />
                                    {message}
                                </motion.div>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="ml-auto btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
