"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Architecture.module.css";
import { useWebGLGallery } from "./hooks/useWebGLGallery";
import { useParisTime } from "./hooks/useParisTime";
import { BASE_IMAGES, FALLBACK_IMAGES, GRID_LAYOUTS } from "./constants";

export default function Architecture(): React.ReactElement {
  // Récupération de l'heure de Paris
  const time = useParisTime();

  // États
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<
    "default" | "alternative" | "mobile"
  >("default");

  // Références React
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intégration de la galerie WebGL
  const { loaded, error, setGalleryRef } = useWebGLGallery(
    `.${styles.imageContainer}`,
    canvasRef as React.RefObject<HTMLCanvasElement>
  );

  // Gestion des clics sur les images
  const handleImageClick = (index: number) => {
    console.log(`Image ${index + 1} clicked`);
    // Ajoutez ici l'action à effectuer au clic (navigation, modal, etc.)
  };

  // Détection de la taille d'écran pour le layout responsive
  useEffect(() => {
    const handleLayoutChange = () => {
      if (window.innerWidth <= 768) {
        setCurrentLayout("mobile");
      } else {
        // Alternance entre les deux layouts desktop
        setCurrentLayout(Math.random() > 0.5 ? "default" : "alternative");
      }
    };

    // Définir le layout initial
    handleLayoutChange();

    // Écouter les changements de taille d'écran
    window.addEventListener("resize", handleLayoutChange);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
    };
  }, []);

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loaded) {
        setImagesLoaded(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [loaded]);

  // Récupération du layout actuel
  const gridLayout = GRID_LAYOUTS[currentLayout];

  // Images de projet (utiliser BASE_IMAGES dans une application réelle)
  const projectImages = BASE_IMAGES;

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Afficher l'erreur si présente */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Canvas WebGL */}
      <canvas ref={canvasRef} className={styles.webglCanvas} />

      {/* Grid overlay */}
      <div className={styles.gridOverlay}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.gridColumn} />
        ))}
      </div>

      {/* Content wrapper */}
      <div className={styles.content}>
        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.main}>
            <span className={styles.label}>About</span>
            <p className={styles.description}>
              Art Director & Immersive Designer, focusing on Creative
              Development, Motion Design and 3D Conception.
            </p>
          </div>
          <div className={styles.timeLocation}>{time} PARIS 2025</div>
        </div>
      </div>

      {/* Galerie avec disposition en grille - structure pour WebGL */}
      <div className={styles.gallery} ref={setGalleryRef}>
        <div className={styles.imageSet}>
          {/* Utilisation des images avec positionnement dynamique */}
          {projectImages.map((src, imgIndex) => {
            const layout = gridLayout[imgIndex] || {};

            return (
              <div
                key={`image-${imgIndex}`}
                className={`${styles.imageContainer} ${
                  imagesLoaded ? styles.loaded : ""
                }`}
                onClick={() => handleImageClick(imgIndex)}
                style={{
                  gridColumn: layout.col,
                  gridRow: layout.row,
                  marginTop: layout.marginTop,
                  transitionDelay: `${imgIndex * 150}ms`,
                }}>
                {/* Couche d'interaction */}
                <Image
                  src={projectImages[imgIndex] || FALLBACK_IMAGES[imgIndex]}
                  alt={`Gallery image ${imgIndex + 1}`}
                  className={styles.image}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={imgIndex < 2}
                  quality={90}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
