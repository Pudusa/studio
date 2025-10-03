'use client';

import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { supabase } from '@/lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: {session} } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
            setUser(session?.user ?? null);
        }

        getInitialSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );
        return () => {
            authListener.subscription.unsubscribe();
        }
    }, []);
    const value = {
        session,
        user,
        loading,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within the AuthProvider');
    }
    return context;
}