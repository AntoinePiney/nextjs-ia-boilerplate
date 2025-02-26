// Fragment shader amélioré pour les images
export const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 uImageSizes;
  uniform vec2 uPlaneSizes;
  uniform sampler2D tMap;
  uniform float uStrength;
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
    
    // Ajout d'un léger effet de chromatic aberration en fonction de uStrength
    float aberration = abs(uStrength) * 0.02;
    
    vec4 cr = texture2D(tMap, uv + vec2(aberration, 0.0));
    vec4 cg = texture2D(tMap, uv);
    vec4 cb = texture2D(tMap, uv - vec2(aberration, 0.0));
    
    gl_FragColor = vec4(cr.r, cg.g, cb.b, 1.0);
    
  }
`;

// Vertex shader amélioré avec effet de distorsion plus élaboré
export const VERTEX_SHADER = `
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
    
    // Effet de vague plus complexe avec déformation horizontale
    float verticalWave = sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0) * -uStrength;
    float horizontalWave = cos(newPosition.x / uViewportSizes.x * PI * 2.0) * -uStrength * 0.5;
    
    // Combinaison des déformations
    newPosition.z += verticalWave + horizontalWave;
    
    // Effets de bord subtils
    float edgeEffect = smoothstep(0.0, 0.2, abs(uv.x - 0.5)) * smoothstep(0.0, 0.2, abs(uv.y - 0.5));
    newPosition.z += edgeEffect * uStrength * 0.3;
    
    vUv = uv;
    gl_Position = projectionMatrix * newPosition;
  }
`;

// Ajout d'un shader de transition pour les changements de page
export const TRANSITION_SHADER = `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uProgress;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Effet de transition avec déplacement
    float progress = uProgress;
    vec2 distortion = vec2(
      sin(uv.y * 10.0 + progress * PI * 2.0) * 0.1 * progress,
      cos(uv.x * 10.0 + progress * PI * 2.0) * 0.1 * progress
    );
    
    vec4 color = texture2D(tMap, uv + distortion);
    
    // Effet de fondu
    color.a = 1.0 - progress;
    
    gl_FragColor = color;
  }
`;
