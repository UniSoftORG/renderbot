import {
  Object3D,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import lens0 from "../assets/textures/lensflare0.png";
import lens3 from "../assets/textures/lensflare3.svg";

/**
 * Creates and sets up a parent object for a given scene.
 *
 * @param {Scene} scene - The scene to add the parent object to.
 * @return {Object3D} The created parent object.
 */
export const setupParent = (scene: Scene) => {
  const parent = new Object3D();
  scene.add(parent);
  return parent;
};

/**
 * Generates a scene, renderer, and camera for a 3D scene setup.
 *
 * @param {React.RefObject<HTMLDivElement>} ref - A reference to the HTML div element that will contain the rendered scene.
 * @param {number} cameraDistance - The distance of the camera from the scene.
 * @return {{ scene: Scene; renderer: WebGLRenderer; camera: PerspectiveCamera }} - An object containing the created Scene, WebGLRenderer, and PerspectiveCamera.
 */
export function setupScene(
  ref: React.RefObject<HTMLDivElement>,
  cameraDistance: number,
): { scene: Scene; renderer: WebGLRenderer; camera: PerspectiveCamera } {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = cameraDistance;

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  ref.current?.appendChild(renderer.domElement);

  return { scene, renderer, camera };
}

/**
 * Loads textures.
 *
 * @return {object} An object containing the loaded textures.
 */
export const loadTextures = () => {
  const textureLoader = new TextureLoader();
  return {
    textureFlare0: textureLoader.load(lens0.src),
  };
};
