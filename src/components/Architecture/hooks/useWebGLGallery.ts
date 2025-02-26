import { useState, useEffect, useRef, useCallback } from "react";
import { BASE_IMAGES, SCROLL_SETTINGS } from "../constants";
import {
  ScrollState,
  TouchState,
  ViewportSize,
  MediaItem,
  OGLModules,
  ScrollDirection,
  WebGLResources,
} from "../types";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "../shaders";

export function useWebGLGallery(
  gallerySelector: string,
  canvasRef: React.RefObject<HTMLCanvasElement>
) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Références
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const oglModulesRef = useRef<OGLModules | null>(null);
  const mediasRef = useRef<MediaItem[]>([]);
  const animationId = useRef<number | null>(null);

  // WebGL resources
  const webglRef = useRef<WebGLResources>({
    renderer: null,
    camera: null,
    scene: null,
    gl: null,
    geometry: null,
  });

  // État de défilement
  const scrollRef = useRef<ScrollState>({
    ease: SCROLL_SETTINGS.ease,
    current: 0,
    target: 0,
    last: 0,
  });

  // État du toucher
  const touchRef = useRef<TouchState>({
    isDown: false,
    position: 0,
    start: 0,
  });

  // Dimensions
  const viewportRef = useRef<ViewportSize>({ width: 0, height: 0 });
  const screenRef = useRef<ViewportSize>({ width: 0, height: 0 });
  const galleryHeightRef = useRef<number>(0);

  // Direction et vitesse
  const directionRef = useRef<ScrollDirection>("down");
  const speedRef = useRef<number>(SCROLL_SETTINGS.initialSpeed);

  // Fonction pour mettre à jour l'échelle des médias
  const updateMediaScale = useCallback((media: MediaItem) => {
    if (!media.bounds) return;

    media.mesh.scale.x =
      (viewportRef.current.width * media.bounds.width) /
      screenRef.current.width;
    media.mesh.scale.y =
      (viewportRef.current.height * media.bounds.height) /
      screenRef.current.height;
  }, []);

  // Fonction pour mettre à jour la position X des médias
  const updateMediaX = useCallback((media: MediaItem, x: number = 0) => {
    if (!media.bounds) return;

    media.mesh.position.x =
      -(viewportRef.current.width / 2) +
      media.mesh.scale.x / 2 +
      ((media.bounds.left - x) / screenRef.current.width) *
        viewportRef.current.width;
  }, []);

  // Fonction pour mettre à jour la position Y des médias
  const updateMediaY = useCallback((media: MediaItem, y: number = 0) => {
    if (!media.bounds) return;

    media.mesh.position.y =
      viewportRef.current.height / 2 -
      media.mesh.scale.y / 2 -
      ((media.bounds.top - y) / screenRef.current.height) *
        viewportRef.current.height -
      media.extra;
  }, []);

  // Fonction pour mettre à jour les bounds des médias
  const updateMediaBounds = useCallback(() => {
    mediasRef.current.forEach((media) => {
      // Obtenir les dimensions
      media.bounds = media.element.getBoundingClientRect();

      // Mettre à jour l'échelle
      updateMediaScale(media);

      // Mettre à jour les positions
      updateMediaX(media);
      updateMediaY(media);

      // Mettre à jour les dimensions dans le shader
      media.program.uniforms.uPlaneSizes.value = [
        media.mesh.scale.x,
        media.mesh.scale.y,
      ];
    });
  }, [updateMediaScale, updateMediaX, updateMediaY]);

  // Redimensionnement
  const handleResize = useCallback(() => {
    if (
      !webglRef.current.renderer ||
      !webglRef.current.camera ||
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
    webglRef.current.renderer.setSize(
      screenRef.current.width,
      screenRef.current.height
    );

    // Mettre à jour la caméra
    webglRef.current.camera.perspective({
      aspect: canvasRef.current.width / canvasRef.current.height,
    });

    // Calculer le viewport
    const fov = webglRef.current.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * webglRef.current.camera.position.z;
    const width = height * webglRef.current.camera.aspect;

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

      updateMediaBounds();
    }
  }, [updateMediaBounds, canvasRef]);

  // Création des médias
  const createMedias = useCallback(() => {
    if (
      !galleryRef.current ||
      !webglRef.current.gl ||
      !webglRef.current.geometry ||
      !webglRef.current.scene ||
      !oglModulesRef.current
    ) {
      console.error("Références manquantes pour la création des médias");
      return;
    }

    // Référence locale au contexte WebGL pour éviter les problèmes de typage
    const gl = webglRef.current.gl;
    const { Mesh, Program, Texture } = oglModulesRef.current;

    const mediaElements = galleryRef.current.querySelectorAll(gallerySelector);

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
        imageObj.src = BASE_IMAGES[index % BASE_IMAGES.length]; // Utilise modulo pour éviter les erreurs

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
          depthTest: false,
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
          geometry: webglRef.current.geometry,
          program,
        });

        mesh.setParent(webglRef.current.scene);

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
    updateMediaBounds();
  }, [gallerySelector, updateMediaBounds]);

  // Boucle d'animation
  const update = useCallback(() => {
    // Mettre à jour le défilement
    scrollRef.current.target += speedRef.current;
    scrollRef.current.current =
      scrollRef.current.current +
      (scrollRef.current.target - scrollRef.current.current) *
        scrollRef.current.ease;

    // Déterminer la direction
    if (scrollRef.current.current > scrollRef.current.last) {
      directionRef.current = "down";
      speedRef.current = SCROLL_SETTINGS.initialSpeed;
    } else if (scrollRef.current.current < scrollRef.current.last) {
      directionRef.current = "up";
      speedRef.current = -SCROLL_SETTINGS.initialSpeed;
    }

    // Mettre à jour chaque média
    mediasRef.current.forEach((media) => {
      updateMediaScale(media);
      updateMediaX(media);
      updateMediaY(media, scrollRef.current.current);

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
    if (
      webglRef.current.renderer &&
      webglRef.current.scene &&
      webglRef.current.camera
    ) {
      webglRef.current.renderer.render({
        scene: webglRef.current.scene,
        camera: webglRef.current.camera,
      });
    }

    // Mettre à jour la dernière position
    scrollRef.current.last = scrollRef.current.current;

    // Continuer l'animation
    animationId.current = requestAnimationFrame(update);
  }, [updateMediaScale, updateMediaX, updateMediaY]);

  // Initialisation WebGL
  const initWebGL = useCallback(async () => {
    if (!canvasRef.current || !oglModulesRef.current) return;

    try {
      const { Renderer, Camera, Transform, Plane } = oglModulesRef.current;

      // Créer le renderer
      webglRef.current.renderer = new Renderer({
        alpha: true,
        antialias: true,
        canvas: canvasRef.current,
        premultipliedAlpha: false,
      });

      webglRef.current.gl = webglRef.current.renderer.gl;

      if (!webglRef.current.gl) {
        throw new Error("Impossible d'obtenir le contexte WebGL");
      }

      // Active la profondeur pour éviter les problèmes d'affichage
      webglRef.current.gl.enable(webglRef.current.gl.DEPTH_TEST);

      // Créer la caméra
      webglRef.current.camera = new Camera(webglRef.current.gl);
      webglRef.current.camera.fov = 45;
      webglRef.current.camera.position.z = 5;

      // Créer la scène
      webglRef.current.scene = new Transform();

      // Créer la géométrie
      webglRef.current.geometry = new Plane(webglRef.current.gl, {
        heightSegments: 10,
        widthSegments: 10,
      });

      // Initialiser les dimensions
      handleResize();

      // Charger et initialiser les médias
      setTimeout(() => {
        createMedias();

        // Démarrer l'animation
        animationId.current = requestAnimationFrame(update);

        setLoaded(true);
      }, 200);
    } catch (err) {
      console.error("Erreur lors de l'initialisation de WebGL:", err);
      setError(
        "Erreur lors de l'initialisation de WebGL. Votre navigateur supporte-t-il WebGL?"
      );
    }
  }, [canvasRef, createMedias, handleResize, update]);

  // Gestionnaires d'événements
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const normalized = event.deltaY;
    scrollRef.current.target += normalized * 0.5;
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchRef.current.isDown = true;
    touchRef.current.position = scrollRef.current.current;
    touchRef.current.start = event.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!touchRef.current.isDown) return;

    const y = event.touches[0].clientY;
    const distance = (touchRef.current.start - y) * 2;

    scrollRef.current.target = touchRef.current.position + distance;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchRef.current.isDown = false;
  }, []);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    touchRef.current.isDown = true;
    touchRef.current.position = scrollRef.current.current;
    touchRef.current.start = event.clientY;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!touchRef.current.isDown) return;

    const y = event.clientY;
    const distance = (touchRef.current.start - y) * 2;

    scrollRef.current.target = touchRef.current.position + distance;
  }, []);

  const handleMouseUp = useCallback(() => {
    touchRef.current.isDown = false;
  }, []);

  // Chargement des modules OGL
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
        initWebGL();
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
  }, [initWebGL]);

  // Configurer la référence pour l'élément galerie
  const setGalleryRef = useCallback((element: HTMLDivElement) => {
    galleryRef.current = element;
  }, []);

  // Attachement des événements
  useEffect(() => {
    if (!loaded) return;

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    loaded,
    handleResize,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Nettoyage global lors du démontage
  useEffect(() => {
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return {
    loaded,
    error,
    setGalleryRef,
  };
}
