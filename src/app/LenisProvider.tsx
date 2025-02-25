"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { usePathname } from "next/navigation";

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const pathname = usePathname(); // Hook pour détecter les changements de route

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Démarre l'animation
    requestAnimationFrame(raf);

    // Reset le scroll en haut de la page lors d'un changement de route
    lenis.scrollTo(0, { immediate: true });

    // Nettoyage
    return () => {
      lenis.destroy();
    };
  }, [pathname]); // Réinitialise Lenis à chaque changement de route

  return <>{children}</>;
}
