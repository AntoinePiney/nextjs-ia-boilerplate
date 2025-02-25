app/
├── components/
│ ├── architecture/
│ │ ├── ArchitectureGallery.tsx # Composant de galerie
│ │ ├── TimeDisplay.tsx # Composant d'horloge
│ │ ├── Footer.tsx # Composant de pied de page  
 │ │ └── GridOverlay.tsx # Composant de grille
│ └── ui/
│ └── ErrorDisplay.tsx # Composant d'erreur réutilisable
├── webgl/
│ ├── hooks/
│ │ ├── useOGLLoader.ts # Hook pour charger OGL
│ │ └── useWebGLSetup.ts # Hook pour configurer WebGL
│ ├── renderers/
│ │ └── GalleryRenderer.ts # Logique de rendu WebGL
│ ├── utils/
│ │ ├── mediaHelpers.ts # Fonctions utilitaires pour les médias
│ │ ├── scrollUtils.ts # Fonctions utilitaires pour le défilement
│ │ └── shaders.ts # Définition des shaders
│ └── types/
│ └── index.ts # Types TypeScript centralisés
├── constants/
│ └── galleryImages.ts # Images et constantes
├── styles/
│ ├── architecture/
│ │ ├── ArchitectureGallery.module.css
│ │ ├── GridOverlay.module.css
│ │ └── Footer.module.css
│ └── globals.css
└── architecture/
└── page.tsx # Page principale
