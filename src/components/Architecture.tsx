/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Architecture.module.css";

// Types améliorés pour TypeScript
interface ScrollState {
  ease: number;
  current: number;
  target: number;
  last: number;
}

interface TouchState {
  isDown: boolean;
  position: number;
  start: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

interface MediaItem {
  element: HTMLElement;
  imgElement: HTMLImageElement;
  mesh: any;
  program: any;
  bounds: DOMRect | null;
  extra: number;
}

// Images de base avec définition de constante
const BASE_IMAGES = [
  "/assets/images/1.jpg",
  "/assets/images/2.jpg",
  "/assets/images/3.jpg",
  "/assets/images/4.jpg",
  "/assets/images/5.jpg",
  "/assets/images/6.jpg",
] as const;

// Shaders définis en dehors du composant pour éviter leur recréation à chaque rendu
const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform sampler2D tMap;
  varying vec2 vUv;

  void main() {
    vec2 ratio = vec2(
      min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
      min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );

    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    gl_FragColor.rgb = texture2D(tMap, uv).rgb;
    gl_FragColor.a = 1.0;
  }
`;

const VERTEX_SHADER = `
  #define PI 3.1415926535897932384626433832795
  precision highp float;
  precision highp int;

  attribute vec3 position;
  attribute vec2 uv;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  uniform float uStrength;
  uniform vec2 uViewportSizes;

  varying vec2 vUv;

  void main() {
    vec4 newPosition = modelViewMatrix * vec4(position, 1.0);
    newPosition.z += sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0) * -uStrength;
    vUv = uv;
    gl_Position = projectionMatrix * newPosition;
  }
`;

export default function Architecture(): React.ReactElement {
  const [time, setTime] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Références React avec types plus précis
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Référence pour les modules OGL
  const oglModulesRef = useRef<{
    Renderer: any;
    Camera: any;
    Transform: any;
    Plane: any;
    Mesh: any;
    Program: any;
    Texture: any;
  } | null>(null);

  // Références pour WebGL avec types plus précis
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const geometryRef = useRef<any>(null);
  const mediasRef = useRef<MediaItem[]>([]);

  // État de défilement memoizé
  const scrollRef = useRef<ScrollState>({
    ease: 0.05,
    current: 0,
    target: 0,
    last: 0,
  });

  // État du toucher memoizé
  const touchRef = useRef<TouchState>({
    isDown: false,
    position: 0,
    start: 0,
  });

  // Dimensions memoizées
  const viewportRef = useRef<ViewportSize>({ width: 0, height: 0 });
  const screenRef = useRef<ViewportSize>({ width: 0, height: 0 });
  const galleryHeightRef = useRef<number>(0);

  // Direction et vitesse
  const directionRef = useRef<"up" | "down">("down");
  const speedRef = useRef<number>(2);

  // Animation frame
  const animationId = useRef<number | null>(null);

  // Références pour les fonctions (pour éviter les dépendances circulaires)
  const updateMediaScaleRef = useRef<(media: MediaItem) => void>(() => {});
  const updateMediaXRef = useRef<(media: MediaItem, x?: number) => void>(
    () => {}
  );
  const updateMediaYRef = useRef<(media: MediaItem, y?: number) => void>(
    () => {}
  );
  const updateMediaBoundsRef = useRef<() => void>(() => {});
  const handleResizeRef = useRef<() => void>(() => {});
  const createMediasRef = useRef<() => void>(() => {});
  const updateRef = useRef<() => void>(() => {});
  const initWebGLRef = useRef<() => void>(() => {});

  // Mise à jour de l'heure de Paris
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

  // Gestionnaires d'événements
  const handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const normalized = event.deltaY;
    scrollRef.current.target += normalized * 0.5;
  };

  const handleMouseDown = (event: MouseEvent): void => {
    touchRef.current.isDown = true;
    touchRef.current.position = scrollRef.current.current;
    touchRef.current.start = event.clientY;
  };

  const handleMouseMove = (event: MouseEvent): void => {
    if (!touchRef.current.isDown) return;

    const y = event.clientY;
    const distance = (touchRef.current.start - y) * 2;

    scrollRef.current.target = touchRef.current.position + distance;
  };

  const handleMouseUp = (): void => {
    touchRef.current.isDown = false;
  };

  const handleTouchStart = (event: TouchEvent): void => {
    touchRef.current.isDown = true;
    touchRef.current.position = scrollRef.current.current;
    touchRef.current.start = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent): void => {
    if (!touchRef.current.isDown) return;

    const y = event.touches[0].clientY;
    const distance = (touchRef.current.start - y) * 2;

    scrollRef.current.target = touchRef.current.position + distance;
  };

  const handleTouchEnd = (): void => {
    touchRef.current.isDown = false;
  };

  // Initialisation des fonctions pour éviter les dépendances circulaires
  useEffect(() => {
    // Définir updateMediaScale
    updateMediaScaleRef.current = (media: MediaItem) => {
      if (!media.bounds) return;

      media.mesh.scale.x =
        (viewportRef.current.width * media.bounds.width) /
        screenRef.current.width;
      media.mesh.scale.y =
        (viewportRef.current.height * media.bounds.height) /
        screenRef.current.height;
    };

    // Définir updateMediaX
    updateMediaXRef.current = (media: MediaItem, x: number = 0) => {
      if (!media.bounds) return;

      media.mesh.position.x =
        -(viewportRef.current.width / 2) +
        media.mesh.scale.x / 2 +
        ((media.bounds.left - x) / screenRef.current.width) *
          viewportRef.current.width;
    };

    // Définir updateMediaY
    updateMediaYRef.current = (media: MediaItem, y: number = 0) => {
      if (!media.bounds) return;

      media.mesh.position.y =
        viewportRef.current.height / 2 -
        media.mesh.scale.y / 2 -
        ((media.bounds.top - y) / screenRef.current.height) *
          viewportRef.current.height -
        media.extra;
    };

    // Définir updateMediaBounds
    updateMediaBoundsRef.current = () => {
      mediasRef.current.forEach((media) => {
        // Obtenir les dimensions
        media.bounds = media.element.getBoundingClientRect();

        // Mettre à jour l'échelle
        updateMediaScaleRef.current(media);

        // Mettre à jour les positions
        updateMediaXRef.current(media);
        updateMediaYRef.current(media);

        // Mettre à jour les dimensions dans le shader
        media.program.uniforms.uPlaneSizes.value = [
          media.mesh.scale.x,
          media.mesh.scale.y,
        ];
      });
    };

    // Définir handleResize
    handleResizeRef.current = () => {
      if (
        !rendererRef.current ||
        !cameraRef.current ||
        !canvasRef.current ||
        !galleryRef.current
      )
        return;

      // Mettre à jour les dimensions
      screenRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Mettre à jour le renderer
      rendererRef.current.setSize(
        screenRef.current.width,
        screenRef.current.height
      );

      // Mettre à jour la caméra
      cameraRef.current.perspective({
        aspect: canvasRef.current.width / canvasRef.current.height,
      });

      // Calculer le viewport
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const height = 2 * Math.tan(fov / 2) * cameraRef.current.position.z;
      const width = height * cameraRef.current.aspect;

      viewportRef.current = { width, height };

      // Calculer la hauteur de la galerie
      const galleryBounds = galleryRef.current.getBoundingClientRect();
      galleryHeightRef.current =
        (viewportRef.current.height * galleryBounds.height) /
        screenRef.current.height;

      // Mettre à jour les médias
      if (mediasRef.current.length > 0) {
        mediasRef.current.forEach((media) => {
          media.extra = 0;
          if (media.program.uniforms.uViewportSizes) {
            media.program.uniforms.uViewportSizes.value = [
              viewportRef.current.width,
              viewportRef.current.height,
            ];
          }
        });

        updateMediaBoundsRef.current();
      }
    };

    // Définir createMedias
    createMediasRef.current = () => {
      if (
        !galleryRef.current ||
        !glRef.current ||
        !geometryRef.current ||
        !sceneRef.current ||
        !oglModulesRef.current
      ) {
        console.error("Références manquantes pour la création des médias");
        return;
      }

      // Référence locale au contexte WebGL pour éviter les problèmes de typage
      const gl = glRef.current;
      const { Mesh, Program, Texture } = oglModulesRef.current;

      const mediaElements = galleryRef.current.querySelectorAll(
        `.${styles.imageContainer}`
      );

      mediasRef.current = Array.from(mediaElements)
        .map((element, index) => {
          const imgElement = element.querySelector("img");
          if (!imgElement) {
            console.error("Élément image introuvable");
            return null;
          }

          // Créer une texture
          const texture = new Texture(gl, {
            generateMipmaps: false,
          });

          // Utiliser le constructeur global window.Image
          const imageObj = new window.Image();
          imageObj.crossOrigin = "anonymous";
          imageObj.src = BASE_IMAGES[index % BASE_IMAGES.length]; // Utilise modulo pour éviter les erreurs si plus d'éléments que d'images

          // Créer le programme
          const program = new Program(gl, {
            fragment: FRAGMENT_SHADER,
            vertex: VERTEX_SHADER,
            uniforms: {
              tMap: { value: texture },
              uPlaneSizes: { value: [0, 0] },
              uImageSizes: { value: [0, 0] },
              uViewportSizes: {
                value: [viewportRef.current.width, viewportRef.current.height],
              },
              uStrength: { value: 0 },
            },
            transparent: true,
            depthTest: false, // Pour un meilleur rendu des transparences
            depthWrite: false,
          });

          // Gérer le chargement de l'image
          imageObj.onload = () => {
            program.uniforms.uImageSizes.value = [
              imageObj.naturalWidth,
              imageObj.naturalHeight,
            ];
            texture.image = imageObj;
          };

          // Créer le mesh
          const mesh = new Mesh(gl, {
            geometry: geometryRef.current,
            program,
          });

          mesh.setParent(sceneRef.current);

          return {
            element: element as HTMLElement,
            imgElement: imgElement as HTMLImageElement,
            mesh,
            program,
            bounds: null,
            extra: 0,
          };
        })
        .filter(Boolean) as MediaItem[];

      // Initialiser les bounds des médias
      updateMediaBoundsRef.current();
    };

    // Définir update
    updateRef.current = () => {
      // Mettre à jour le défilement
      scrollRef.current.target += speedRef.current;
      scrollRef.current.current =
        scrollRef.current.current +
        (scrollRef.current.target - scrollRef.current.current) *
          scrollRef.current.ease;

      // Déterminer la direction
      if (scrollRef.current.current > scrollRef.current.last) {
        directionRef.current = "down";
        speedRef.current = 2;
      } else if (scrollRef.current.current < scrollRef.current.last) {
        directionRef.current = "up";
        speedRef.current = -2;
      }

      // Mettre à jour chaque média
      mediasRef.current.forEach((media) => {
        updateMediaScaleRef.current(media);
        updateMediaXRef.current(media);
        updateMediaYRef.current(media, scrollRef.current.current);

        const planeOffset = media.mesh.scale.y / 2;
        const viewportOffset = viewportRef.current.height / 2;

        const isBefore = media.mesh.position.y + planeOffset < -viewportOffset;
        const isAfter = media.mesh.position.y - planeOffset > viewportOffset;

        if (directionRef.current === "up" && isBefore) {
          media.extra -= galleryHeightRef.current;
        }

        if (directionRef.current === "down" && isAfter) {
          media.extra += galleryHeightRef.current;
        }

        // Mettre à jour l'effet de distorsion
        media.program.uniforms.uStrength.value =
          ((scrollRef.current.current - scrollRef.current.last) /
            screenRef.current.width) *
          10;
      });

      // Rendu
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render({
          scene: sceneRef.current,
          camera: cameraRef.current,
        });
      }

      // Mettre à jour la dernière position
      scrollRef.current.last = scrollRef.current.current;

      // Continuer l'animation
      animationId.current = requestAnimationFrame(updateRef.current);
    };

    // Définir initWebGL
    initWebGLRef.current = () => {
      if (!canvasRef.current || !oglModulesRef.current) return;

      try {
        const { Renderer, Camera, Transform, Plane } = oglModulesRef.current;

        // Créer le renderer
        rendererRef.current = new Renderer({
          alpha: true,
          antialias: true, // Amélioration de la qualité
          canvas: canvasRef.current,
          premultipliedAlpha: false, // Optimisation pour la transparence
        });

        glRef.current = rendererRef.current.gl;

        if (!glRef.current) {
          throw new Error("Impossible d'obtenir le contexte WebGL");
        }

        // Active la profondeur pour éviter les problèmes d'affichage
        glRef.current.enable(glRef.current.DEPTH_TEST);

        // Créer la caméra
        cameraRef.current = new Camera(glRef.current);
        cameraRef.current.fov = 45;
        cameraRef.current.position.z = 5;

        // Créer la scène
        sceneRef.current = new Transform();

        // Créer la géométrie
        geometryRef.current = new Plane(glRef.current, {
          heightSegments: 10,
          widthSegments: 10, // Amélioration de la qualité
        });

        // Initialiser les dimensions
        handleResizeRef.current();

        // Charger et initialiser les médias
        setTimeout(() => {
          createMediasRef.current();

          // Démarrer l'animation
          animationId.current = requestAnimationFrame(updateRef.current);

          setLoaded(true);
        }, 200);
      } catch (err) {
        console.error("Erreur lors de l'initialisation de WebGL:", err);
        setError(
          "Erreur lors de l'initialisation de WebGL. Votre navigateur supporte-t-il WebGL?"
        );
      }
    };
  }, []);

  // Chargement dynamique des modules OGL
  useEffect(() => {
    let isMounted = true;

    const loadOGLModules = async () => {
      try {
        // Import dynamique des modules OGL
        const oglModule = await import("ogl");

        if (!isMounted) return;

        // Stocker les modules dans la ref
        oglModulesRef.current = {
          Renderer: oglModule.Renderer,
          Camera: oglModule.Camera,
          Transform: oglModule.Transform,
          Plane: oglModule.Plane,
          Mesh: oglModule.Mesh,
          Program: oglModule.Program,
          Texture: oglModule.Texture,
        };

        // Initialiser WebGL
        initWebGLRef.current();
      } catch (err) {
        console.error("Erreur lors du chargement des modules OGL:", err);
        if (isMounted) {
          setError(
            "Erreur lors du chargement des modules WebGL. Assurez-vous que 'ogl' est correctement installé."
          );
        }
      }
    };

    loadOGLModules();

    return () => {
      isMounted = false;

      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  // Gestion des événements - optimisé avec utilisation de useEffect et cleanup
  useEffect(() => {
    if (!loaded) return;

    window.addEventListener("resize", handleResizeRef.current, {
      passive: true,
    });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResizeRef.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [loaded]);

  // Nettoyage global lors du démontage
  useEffect(() => {
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  // Rendu du composant
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
      <div className={styles.gallery} ref={galleryRef}>
        <div className={styles.imageSet}>
          {BASE_IMAGES.map((src, imgIndex) => (
            <div
              key={`image-${imgIndex}`}
              className={styles.imageContainer}
              onClick={() => {
                // Ajoutez ici l'action à effectuer au clic
                console.log(`Image ${imgIndex + 1} clicked`);
                // Par exemple ouvrir une modal ou naviguer vers une page
              }}>
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
