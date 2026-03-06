'use client';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '@/lib/apiClient';

export default function CartPage() {
    const { cart, removeFromCart } = useAuthStore();

    const handleRemove = async (id: number) => {
        try {
            await apiClient.delete(`/cart/${id}`);
            removeFromCart(id);
        } catch (err) {
            console.error(err);
        }
    };

    const total = cart.length;

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-slate-400" />
                </div>
                <h1 className="text-3xl font-black text-slate-900">Your cart is empty</h1>
                <p className="text-slate-500 max-w-xs text-center">Looks like you haven't added any courses yet. Start exploring our catalog to forge your future!</p>
                <Link href="/" className="btn-primary">Explore Courses</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                Shopping Cart <span className="bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-lg">{total}</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white border border-slate-200 rounded-3xl p-6 flex gap-6 group hover:border-sky-200 transition-all shadow-sm"
                        >
                            <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0">
                                <BookOpen className="w-10 h-10 text-sky-600" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-1">{item.description}</p>
                                <div className="mt-4 flex items-center gap-4">
                                    <button className="text-sky-600 font-bold text-sm hover:underline">Move to Wishlist</button>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-500 font-bold text-sm flex items-center gap-1 hover:underline"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl sticky top-24">
                        <h2 className="text-2xl font-black mb-6">Total:</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-400">
                                <span>Original Price</span>
                                <span className="line-through">$Free</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black">
                                <span>SkillForge Price</span>
                                <span className="text-sky-400">FREE</span>
                            </div>
                        </div>
                        <button className="w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95">
                            Checkout <ArrowRight className="w-5 h-5" />
                        </button>
                        <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-widest font-black">Secure Checkout via SkillForge Pay</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
