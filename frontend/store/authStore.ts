import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    name: string;
    dob?: string;
    gender?: string;
    skills?: string;
}

interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    cart: Subject[];
    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
    addToCart: (item: Subject) => void;
    removeFromCart: (id: number) => void;
    setCart: (items: Subject[]) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            cart: [],
            setAuth: (user, token) => {
                localStorage.setItem('accessToken', token);
                set({ user, accessToken: token });
            },
            setUser: (user) => set({ user }),
            logout: () => {
                localStorage.removeItem('accessToken');
                set({ user: null, accessToken: null, cart: [] });
            },
            addToCart: (item) => set((state) => ({
                cart: state.cart.some(i => i.id === item.id) ? state.cart : [...state.cart, item]
            })),
            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter(i => i.id !== id)
            })),
            setCart: (items) => set({ cart: items })
        }),
        {
            name: 'auth-storage'
        }
    )
);
