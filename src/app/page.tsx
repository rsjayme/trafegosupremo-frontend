"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Usando um pequeno delay para evitar problemas de estado inicial
    const timer = setTimeout(() => {
      if (!token) {
        router.replace("/login");
      } else {
        // Redirecionando diretamente para o dashboard que está no grupo autenticado
        router.push("/dashboard");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [token, router]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
}
