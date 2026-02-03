"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

let supabaseClient: SupabaseClientType | null = null;

// Singleton pattern to avoid recreating client
function getSupabaseClient(): SupabaseClientType | null {
    if (typeof window === 'undefined') {
        return null;
    }

    if (supabaseClient) {
        return supabaseClient;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase credentials not found');
        return null;
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseKey);
    return supabaseClient;
}

export function createClient() {
    return getSupabaseClient();
}

// Hook for auth state
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabaseClient();

        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
            setUser(user);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading };
}
