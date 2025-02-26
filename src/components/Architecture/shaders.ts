/**
 * Shaders optimisés pour l'affichage des images avec effets
 * Optimisations principales:
 * - Calculs vectoriels minimisés et optimisés
 * - Précalculs pour réduire les opérations dans les boucles
 * - Utilisation de constantes pour éviter les recalculs
 */

/**
 * Fragment shader optimisé pour les images
 * - Utilise des opérations vectorielles unifiées pour les calculs de couleur
 * - Réduit le nombre d'échantillonnages de texture
 */
export const FRAGMENT_SHADER = `
  precision mediump float; // mediump au lieu de highp pour les appareils mobiles
  
  // Uniforms
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform sampler2D tMap;
  uniform float uStrength;
  
  // Varyings
  varying vec2 vUv;
  
  void main() {
    // Calcul du ratio une seule fois pour réutilisation
    vec2 ratio = vec2(
      min(uPlaneSizes.x / uImageSizes.x * uImageSizes.y / uPlaneSizes.y, 1.0),
      min(uPlaneSizes.y / uImageSizes.y * uImageSizes.x / uPlaneSizes.x, 1.0)
    );
    
    // Alignement avec précalcul
    vec2 uv = vUv * ratio + 0.5 * (1.0 - ratio);
    
    // Facteur d'aberration optimisé
    float strength = clamp(abs(uStrength) * 0.01, 0.0, 0.03);
    
    // Échantillonnage vectoriel des couleurs avec vec2(±strength, 0.0)
    vec4 r = texture2D(tMap, uv + vec2(strength, 0.0));
    vec4 g = texture2D(tMap, uv);
    vec4 b = texture2D(tMap, uv - vec2(strength, 0.0));
    
    // Assignation directe des composantes RGB
    gl_FragColor = vec4(r.r, g.g, b.b, g.a);
  }
`;

/**
 * Vertex shader optimisé
 * - Utilise des constantes pour éviter de recalculer PI
 * - Réduit le nombre d'opérations trigonométriques
 * - Utilise des facteurs précalculés pour les vagues
 */
export const VERTEX_SHADER = `
  #define PI 3.1415926535897932384626433832795
  
  // Précision adaptée aux mobiles
  precision mediump float;
  precision mediump int;
  
  // Attributs
  attribute vec3 position;
  attribute vec2 uv;
  
  // Uniforms
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uStrength;
  uniform vec2 uViewportSizes;
  
  // Varyings
  varying vec2 vUv;
  
  void main() {
    // Position de base avec la matrice de vue
    vec4 newPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Facteurs normalisés pour réduire les calculs
    vec2 normalizedPos = vec2(
      newPosition.x / uViewportSizes.x,
      newPosition.y / uViewportSizes.y
    );
    
    // Constantes pour optimiser les calculs d'ondulation
    const float WAVE_Y_MULT = -0.8;
    const float WAVE_X_MULT = -0.3;
    const float EDGE_MULT = 0.2;
    
    // Calcul des ondes avec moins d'opérations
    float wave = WAVE_Y_MULT * uStrength * sin(normalizedPos.y * PI + PI * 0.5);
    wave += WAVE_X_MULT * uStrength * cos(normalizedPos.x * PI * 1.5);
    
    // Application de la déformation
    newPosition.z += wave;
    
    // Effet de bord optimisé avec une seule fonction max() et smoothstep()
    float edgeFactor = max(abs(uv.x - 0.5), abs(uv.y - 0.5));
    newPosition.z += EDGE_MULT * uStrength * smoothstep(0.0, 0.35, edgeFactor);
    
    // Transmission des coordonnées UV
    vUv = uv;
    
    // Calcul de la position finale
    gl_Position = projectionMatrix * newPosition;
  }
`;
