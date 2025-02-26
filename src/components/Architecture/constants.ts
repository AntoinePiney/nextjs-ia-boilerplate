// Chemins des images pour la démo
// Dans une application réelle, ces images seraient remplacées par vos propres images
export const BASE_IMAGES = [
  "/assets/images/profile.jpg",
  "/assets/images/profile.jpg",
  "/assets/images/profile.jpg",
  "/assets/images/profile.jpg",
  "/assets/images/profile.jpg",
  "/assets/images/profile.jpg",
] as const;

// Version de secours si les images ci-dessus ne sont pas trouvées
export const FALLBACK_IMAGES = [
  "/assets/images/blank.webp",
  "/assets/images/blank.webp",
  "/assets/images/blank.webp",
  "/assets/images/blank.webp",
  "/assets/images/blank.webp",
  "/assets/images/blank.webp",
] as const;

// Paramètres d'animation et de défilement
export const SCROLL_SETTINGS = {
  ease: 0.05,
  initialSpeed: 2,
};

// Paramètres pour l'effet parallaxe
export const PARALLAX_SETTINGS = {
  mouseFactor: 0.03, // Intensité de l'effet de suivi de souris
  scrollFactor: 0.1, // Intensité de l'effet lors du défilement
  depthFactor: 0.2, // Différence de profondeur entre les couches
};

// Layout de la grille - définit comment les images seront placées
export const GRID_LAYOUTS = {
  default: [
    { col: "2 / span 4", row: 1, marginTop: "5vh" },
    { col: "8 / span 4", row: 2, marginTop: "20vh" },
    { col: "4 / span 5", row: 3, marginTop: "30vh" },
    { col: "2 / span 3", row: 5, marginTop: "15vh" },
    { col: "7 / span 4", row: 6, marginTop: "25vh" },
    { col: "3 / span 5", row: 8, marginTop: "20vh" },
  ],

  // Version alternative du layout
  alternative: [
    { col: "2 / span 5", row: 1, marginTop: "10vh" },
    { col: "7 / span 3", row: 3, marginTop: "15vh" },
    { col: "3 / span 4", row: 5, marginTop: "25vh" },
    { col: "8 / span 3", row: 7, marginTop: "12vh" },
    { col: "2 / span 3", row: 9, marginTop: "20vh" },
    { col: "6 / span 4", row: 11, marginTop: "15vh" },
  ],

  // Layout mobile
  mobile: [
    { col: "1 / span 4", row: 1, marginTop: "5vh" },
    { col: "2 / span 4", row: 3, marginTop: "10vh" },
    { col: "1 / span 4", row: 5, marginTop: "10vh" },
    { col: "2 / span 4", row: 7, marginTop: "10vh" },
    { col: "1 / span 4", row: 9, marginTop: "10vh" },
    { col: "2 / span 4", row: 11, marginTop: "10vh" },
  ],
};
