"use client";

import { createContext, useContext, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  // TanStack Query로 세션 관리 - 중복 요청 방지
  const { data: session, isLoading } = useQuery({
    queryKey: ["authSession"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 30, // 30분
  });

  // 인증 상태 변화 감지 - 캐시 무효화만 수행
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // 로그인/로그아웃 시에만 캐시 무효화
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        queryClient.invalidateQueries({ queryKey: ["authSession"] });
        // 로그아웃 시 관련 쿼리도 무효화
        if (event === "SIGNED_OUT") {
          queryClient.invalidateQueries({ queryKey: ["googleTokens"] });
          queryClient.invalidateQueries({ queryKey: ["googleCalendars"] });
          queryClient.invalidateQueries({ queryKey: ["googleEvents"] });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider value={{ user, loading: isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
