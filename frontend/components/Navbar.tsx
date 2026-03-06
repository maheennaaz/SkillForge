'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { LogOut, User, Search, Menu, ShoppingCart, Globe, Compass, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export default function Navbar() {
    const { user, logout, cart, setCart } = useAuthStore();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const syncCart = async () => {
            if (user) {
                try {
                    const { data } = await apiClient.get('/cart');
                    setCart(data);
                } catch (err) {
                    console.error('Failed to sync cart', err);
                }
            }
        };
        syncCart();
    }, [user, setCart]);
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
            <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center space-x-4 md:space-x-8">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 shrink-0 group">
                    <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:rotate-12 transition-transform">
                        <span className="text-white font-black text-xl italic">SF</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">SkillForge</span>
                        <span className="text-[10px] text-sky-600 font-bold -mt-1 uppercase tracking-widest hidden md:block">Mastery Reimagined</span>
                    </div>
                </Link>

                {/* Main Links */}
                <div className="hidden lg:flex items-center space-x-6">
                    <Link href="/" className="text-sm font-bold text-slate-800 hover:text-sky-600 transition-colors">
                        Home
                    </Link>
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                        Courses
                    </Link>
                    <Link href="/roadmap" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                        Learning Roadmap
                    </Link>
                    <Link href="/career" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                        Career Support
                    </Link>
                </div>

                {/* Search Bar */}
                <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/?search=${search}`; }} className="flex-grow max-w-2xl relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="w-full bg-slate-50 border border-slate-900/10 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>

                <div className="flex items-center space-x-4">
                    {user && (
                        <Link href="/dashboard" className="hidden xl:block text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors">
                            Dashboard
                        </Link>
                    )}

                    <Link href="/cart" className="p-2 hover:bg-slate-100 rounded-full transition-colors relative group">
                        <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-sky-600" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/40">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/profile" className="flex items-center space-x-2 p-1 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200">
                                <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold">
                                    {user.name[0]}
                                </div>
                                <span className="text-sm font-bold text-slate-700 hidden sm:block">{user.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link href="/auth/login" className="px-5 py-2.5 text-sm font-bold border border-slate-900 text-slate-900 hover:bg-slate-50 transition-colors">
                                Log in
                            </Link>
                            <Link href="/auth/register" className="px-5 py-2.5 text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                                Sign up
                            </Link>
                            <button className="p-2 border border-slate-900 hover:bg-slate-50 transition-colors">
                                <Globe className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
