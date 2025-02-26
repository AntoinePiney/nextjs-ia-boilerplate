import { useState, useEffect, useRef } from "react";

/**
 * Hook optimisé qui fournit l'heure actuelle de Paris, mise à jour chaque seconde
 * avec des optimisations de performance:
 * - Utilisation de useRef pour réduire les rendus inutiles
 * - Caching des options pour éviter les recréations
 * - Gestion intelligente de l'intervalle selon la visibilité du document
 *
 * @returns {string} L'heure actuelle au format HH:MM
 */
export function useParisTime(): string {
  const [time, setTime] = useState<string>("");
  const intervalRef = useRef<number | null>(null);

  // Mémoiser les options de formatage pour éviter les recréations
  const optionsRef = useRef<Intl.DateTimeFormatOptions>({
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Mémoriser le formateur pour réutilisation
  const formatterRef = useRef<Intl.DateTimeFormat | null>(null);

  useEffect(() => {
    // Créer le formateur une seule fois
    if (!formatterRef.current) {
      formatterRef.current = new Intl.DateTimeFormat(
        "fr-FR",
        optionsRef.current
      );
    }

    const updateTime = (): void => {
      if (formatterRef.current) {
        setTime(formatterRef.current.format(new Date()));
      } else {
        // Fallback si le formateur n'est pas disponible
        const date = new Date();
        setTime(date.toLocaleTimeString("fr-FR", optionsRef.current));
      }
    };

    // Mise à jour initiale
    updateTime();

    // Fonction pour gérer les intervalles selon la visibilité
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Arrêter l'intervalle lorsque la page n'est pas visible
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Mise à jour immédiate et redémarrage de l'intervalle
        updateTime();
        if (intervalRef.current === null) {
          intervalRef.current = window.setInterval(updateTime, 1000);
        }
      }
    };

    // Démarrer l'intervalle
    intervalRef.current = window.setInterval(updateTime, 1000);

    // Ajouter l'écouteur de visibilité
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      // Nettoyage
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return time;
}
