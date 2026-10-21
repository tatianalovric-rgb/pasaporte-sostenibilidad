import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PublicUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "./i18n";

interface AuthContextType {
  user: PublicUser | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; companyName: string }) => Promise<void>;
  logout: () => Promise<void>;
  companies: PublicUser[];
  activeCompanyId: string | null;
  setActiveCompanyId: (id: string | null) => void;
  isConsultant: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { t } = useI18n();

  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("esg_active_company_id") || null;
    }
    return null;
  });

  const setActiveCompanyId = (id: string | null) => {
    setActiveCompanyIdState(id);
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem("esg_active_company_id", id);
      } else {
        localStorage.removeItem("esg_active_company_id");
      }
    }
    // Invalida las entradas de query para que la UI recargue inmediatamente los datos de la empresa seleccionada
    queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
  };

  // Verifica sesión actual
  const { data: user = null, isLoading: isLoadingUser } = useQuery<PublicUser | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) return null;
        if (!res.ok) return null;
        const data = await res.json();
        return data.user as PublicUser;
      } catch {
        return null;
      }
    },
    staleTime: 60000,
  });

  const isConsultant = user?.role === "consultant";

  // Si es consultora, obtiene el listado de empresas registradas
  const { data: companies = [] } = useQuery<PublicUser[]>({
    queryKey: ["/api/companies"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/companies");
        if (!res.ok) return [];
        return (await res.json()) as PublicUser[];
      } catch {
        return [];
      }
    },
    enabled: isConsultant,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await res.json();
      return data.user as PublicUser;
    },
    onSuccess: (loggedUser) => {
      queryClient.setQueryData(["/api/auth/me"], loggedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      if (loggedUser.role === "consultant") {
        queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      }
      toast({
        title: t("loginSuccessToast"),
        description: t("loginSuccessToastDesc"),
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string; companyName: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", payload);
      const data = await res.json();
      return data.user as PublicUser;
    },
    onSuccess: (registeredUser) => {
      queryClient.setQueryData(["/api/auth/me"], registeredUser);
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: t("registerSuccessToast"),
        description: t("registerSuccessToastDesc"),
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      setActiveCompanyId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: t("logoutSuccessToast"),
      });
    },
  });

  const login = async (data: { email: string; password: string }) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: { email: string; password: string; companyName: string }) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoadingUser,
        login,
        register,
        logout,
        companies,
        activeCompanyId,
        setActiveCompanyId,
        isConsultant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
