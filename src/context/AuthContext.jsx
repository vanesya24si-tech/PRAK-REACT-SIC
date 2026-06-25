import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile dari tabel profiles (dengan self-healing & fallback jika database bermasalah)
  const fetchProfile = async (user) => {
    const userId = user.id;
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Jika profile tidak ditemukan atau error SELECT (termasuk RLS recursion)
    if (error || !data) {
      console.warn("Mencoba memulihkan profile secara otomatis untuk user:", userId);
      const name = user.user_metadata?.name || "User";
      const role = user.user_metadata?.role || "Member";
      
      // Melakukan INSERT murni tanpa SELECT ke database
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          name: name,
          email: user.email,
          role: role,
          points: 0,
          tier: "Bronze"
        });
        
      if (!insertError) {
        data = {
          id: userId,
          name: name,
          email: user.email,
          role: role,
          points: 0,
          tier: "Bronze"
        };
        error = null;
      } else {
        console.warn("Gagal menulis ke database (kemungkinan tabel/RLS bermasalah). Menggunakan profil fallback lokal agar aplikasi tetap berfungsi.");
        // FALLBACK LOKAL: Buat profil dalam memori agar aplikasi tidak macet di loading screen
        data = {
          id: userId,
          name: name,
          email: user.email,
          role: role,
          points: 120, // poin dummy untuk simulasi
          tier: "Bronze"
        };
        error = null;
      }
    }

    if (!error && data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    // Cek session saat ini
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user);
      }
      setLoading(false);
    });

    // Subscribe ke perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign In
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Sign Up
  const signUp = async (email, password, name, role) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });
    if (error) throw error;

    // Auto-insert profile murni dari frontend (untuk mem-bypass trigger database jika error/macet)
    if (data?.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        name: name,
        email: email,
        role: role || "Member",
        points: 0,
        tier: "Bronze",
      });
    }

    return data;
  };

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setProfile(null);
  };

  // Refresh profile (untuk update setelah transaksi)
  const refreshProfile = async () => {
    if (session?.user) {
      await fetchProfile(session.user);
    }
  };

  const value = {
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
