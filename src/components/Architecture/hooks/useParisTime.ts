import { useState, useEffect } from "react";

/**
 * Hook qui fournit l'heure actuelle de Paris, mise à jour chaque seconde
 * @returns {string} L'heure actuelle au format HH:MM
 */
export function useParisTime(): string {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = (): void => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(date.toLocaleTimeString("fr-FR", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
