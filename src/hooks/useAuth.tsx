import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "agent" | "customer";

type AuthValue = {
  user: User | null;
  session: Session | null;
  roles: Role[];
  isStaff: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      
      // Intent: If the user explicitly logged in without "Remember Me", 
      // we check our marker. If it exists, we ensure the session is cleared 
      // when the browser tab closes by defaulting to sessionStorage behaviors 
      // if the client doesn't support it natively.
      if (next && sessionStorage.getItem("ethhs-session-only")) {
        // We let the current session persist for this tab, 
        // but we've already set ethhs-session-only in auth.tsx
      }
    });
    
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setRoles([]);
      return;
    }
    let cancelled = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (!cancelled) setRoles((data ?? []).map((r) => r.role as Role));
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user: session?.user ?? null,
      session,
      roles,
      isStaff: roles.includes("admin") || roles.includes("agent"),
      loading,
      signOut,
    }),
    [session, roles, loading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
