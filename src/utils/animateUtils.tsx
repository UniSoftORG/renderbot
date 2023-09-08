import {
  Camera,
  LineSegments,
  Object3D,
  Points,
  Scene,
  WebGLRenderer,
} from "three";

let breatheDirection = 1;
let breatheSize = 1;
let circleBreatheDirection = 0.2;
let circleBreatheSize = 0.15;

/**
 * Animates the scaling of points, lines, and ringPoints objects to create a breathing effect.
 *
 * @param {Points} points - The points object to be scaled.
 * @param {LineSegments} lines - The lines object to be scaled.
 * @param {Object3D[]} ringPoints - An array of ringPoints objects to be scaled.
 */
const breathe = (
  points: Points,
  lines: LineSegments,
  ringPoints: Object3D[],
) => {
  breatheSize += 0.001 * breatheDirection;
  if (breatheSize > 1.1 || breatheSize < 0.95) {
    breatheDirection *= -1;
  }

  circleBreatheSize += 0.01 * circleBreatheDirection;
  if (circleBreatheSize > 1.05 || circleBreatheDirection < 0.95) {
    circleBreatheDirection *= -1;
  }

  points.scale.set(breatheSize, breatheSize, breatheSize);
  lines.scale.set(breatheSize, breatheSize, breatheSize);
  ringPoints.forEach(
    (ring, index) =>
      index !== 3 &&
      ring.scale.set(
        index > 3 ? circleBreatheSize : breatheSize,
        index > 3 ? circleBreatheSize : breatheSize,
        index > 3 ? circleBreatheSize : breatheSize,
      ),
  );
};

/**
 * Rotates the given points, lines, and ringPoints.
 *
 * @param {Object3D} points - The points to rotate.
 * @param {LineSegments} lines - The lines to rotate.
 * @param {Object3D[]} ringPoints - The ring points to rotate.
 */
const rotate = (
  points: Object3D,
  lines: LineSegments,
  ringPoints: Object3D[],
) => {
  lines.rotation.x += 0.001;

  points.rotation.x += 0.001;
  points.rotation.y += 0.001;

  ringPoints.forEach((ring, index) => {
    const directionX = index % 2 === 0 ? 1 : -1;
    const directionY = index % 2 === 0 ? 1 : -1;
    const directionZ = index % 2 === 0 ? 1 : -1;

    ring.rotation.x += directionX * 0.002 * (index + 1);
    ring.rotation.y += directionY * 0.002 * (index + 1);
    ring.rotation.z += directionZ * 0.002 * (index + 1);
  });
};

/**
 * Creates a render loop that continuously updates the scene and renders it.
 *
 * @param {Scene} scene - The scene to be rendered.
 * @param {Camera} camera - The camera used to view the scene.
 * @param {WebGLRenderer} renderer - The renderer that will render the scene.
 * @param {Points} points - The points object representing the scene's points.
 * @param {Object3D[]} ringPoints - An array of Object3D representing the ring points.
 * @param {LineSegments} lines - The lines object representing the scene's lines.
 * @return {void} This function does not return a value.
 */
export const createRenderLoop = (
  scene: Scene,
  camera: Camera,
  renderer: WebGLRenderer,
  points: Points | any,
  ringPoints: Object3D[] | any,
  lines: LineSegments | any,
): void => {
  /**
   * Animates the scene by continuously calling the breathe, rotate, and renderer functions.
   *
   * @param {void} - This function does not take any parameters.
   * @return {void} - This function does not return any value.
   */
  const animate = (): void => {
    requestAnimationFrame(animate);

    breathe(points, lines, ringPoints);
    rotate(points, lines, ringPoints);
    renderer.render(scene, camera);
  };

  animate();
};
