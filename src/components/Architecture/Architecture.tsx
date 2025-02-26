"use client";
import React, { useRef } from "react";
import Image from "next/image";
import styles from "./Architecture.module.css";
import { useWebGLGallery } from "./hooks/useWebGLGallery";
import { useParisTime } from "./hooks/useParisTime";
import { BASE_IMAGES } from "./constants";

export default function Architecture(): React.ReactElement {
  // Récupération de l'heure de Paris
  const time = useParisTime();

  // Références React
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intégration de la galerie WebGL
  const { error, setGalleryRef } = useWebGLGallery(
    `.${styles.imageContainer}`,
    canvasRef as React.RefObject<HTMLCanvasElement>
  );

  // Gestion des clics sur les images
  const handleImageClick = (index: number) => {
    console.log(`Image ${index + 1} clicked`);
    // Ajoutez ici l'action à effectuer au clic (navigation, modal, etc.)
  };

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

      {/* Galerie avec défilement infini - structure pour WebGL */}
      <div className={styles.gallery} ref={setGalleryRef}>
        <div className={styles.imageSet}>
          {BASE_IMAGES.map((src, imgIndex) => (
            <div
              key={`image-${imgIndex}`}
              className={styles.imageContainer}
              onClick={() => handleImageClick(imgIndex)}>
              {/* Couche d'interaction */}
              <div className={styles.imageOverlay}></div>
              <Image
                src={src}
                alt={`Gallery image ${imgIndex + 1}`}
                className={styles.image}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={imgIndex === 0}
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
