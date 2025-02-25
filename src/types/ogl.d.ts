declare module "ogl" {
  export interface Vec3 {
    x: number;
    y: number;
    z: number;
  }

  export interface RenderOptions {
    scene: Transform;
    camera: Camera;
  }

  export interface RendererOptions {
    alpha?: boolean;
    antialias?: boolean;
    canvas: HTMLCanvasElement;
    premultipliedAlpha?: boolean;
  }

  export interface PerspectiveOptions {
    aspect: number;
  }

  export interface PlaneOptions {
    heightSegments?: number;
    widthSegments?: number;
  }

  // Définition d'un type générique pour la géométrie
  export interface Geometry {
    // Propriétés minimales attendues d'une géométrie
    [key: string]: unknown;
  }

  export interface MeshOptions {
    geometry: Geometry;
    program: Program;
  }

  // Type pour les valeurs uniformes
  export type UniformValue =
    | number
    | number[]
    | Float32Array
    | WebGLTexture
    | Texture;

  export interface ProgramOptions {
    fragment: string;
    vertex: string;
    uniforms: Record<string, { value: UniformValue }>;
    transparent?: boolean;
    depthTest?: boolean;
    depthWrite?: boolean;
  }

  export interface TextureOptions {
    generateMipmaps: boolean;
  }

  export class Renderer {
    gl: WebGLRenderingContext;
    constructor(options: RendererOptions);
    setSize(width: number, height: number): void;
    render(options: RenderOptions): void;
  }

  export class Camera {
    fov: number;
    aspect: number;
    position: Vec3;
    constructor(gl: WebGLRenderingContext);
    perspective(options: PerspectiveOptions): void;
  }

  export class Transform {
    constructor();
  }

  export class Plane implements Geometry {
    [key: string]: unknown;
    constructor(gl: WebGLRenderingContext, options?: PlaneOptions);
  }

  export class Mesh {
    scale: { x: number; y: number };
    position: Vec3;
    constructor(gl: WebGLRenderingContext, options: MeshOptions);
    setParent(parent: Transform): void;
  }

  export class Program {
    uniforms: Record<string, { value: UniformValue }>;
    constructor(gl: WebGLRenderingContext, options: ProgramOptions);
  }

  export class Texture {
    image: HTMLImageElement;
    constructor(gl: WebGLRenderingContext, options?: TextureOptions);
  }
}
