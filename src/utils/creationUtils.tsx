import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Object3D,
  PointLight,
  Points,
  PointsMaterial,
  Spherical,
  Texture,
  Vector3,
} from "three";
import { AppConfig } from "@visual";

const tempVector = new Vector3();
const tempSpherical = new Spherical();

/**
 * Sets up particles in a scene based on the given configuration.
 *
 * @param {Object3D} scene - The scene to add the particles to.
 * @param {AppConfig} config - The configuration object for the particles.
 * @return {Points} The created particles object.
 */
export const setupParticles = (scene: Object3D, config: AppConfig): Points => {
  // Create arrays to store particle positions, sizes, and colors
  const positions = new Float32Array(config.POINTS * 3);
  const sizes = new Float32Array(config.POINTS);
  const colors = new Float32Array(config.COLORS * 3);

  // Generate random particle positions within a certain range
  for (let i = 0; i < 1000 * 3; i += 3) {
    // Calculate a random radius within the maximum distance
    const radius = config.MAX_DISTANCE + Math.random() * 4;

    // Create a spherical coordinate with random angles
    tempSpherical.set(
      radius,
      3 * Math.PI * Math.random(),
      Math.PI * Math.random(),
    );

    // Convert the spherical coordinate to a Cartesian coordinate
    tempVector.setFromSpherical(tempSpherical);
    // Set the particle position in the positions array
    positions.set([tempVector.x, tempVector.y, tempVector.z], i);
  }

  // Create a buffer geometry to store the particle data
  const geometry = new BufferGeometry();
  // Set the positions, sizes, and colors attributes of the geometry
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("size", new BufferAttribute(sizes, 1));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));

  // Create a material for the particles
  const pointsMaterial = new PointsMaterial({
    color: config.DARK_COLOR,
    size: 0.2,
    blending: AdditiveBlending,
    transparent: true,
  });

  // Create a points object with the geometry and material
  const points = new Points(geometry, pointsMaterial);
  // Set the original color of the points for later use
  points.userData.originalColor = new Color(config.PRIMARY_COLOR);
  // Add the points to the scene
  scene.add(points);
  // Store the points object in the scene's user data for later use
  scene.userData.points = points;

  // Return the created particles object
  return points;
};

/**
 * Creates line segments between the closest points in a given set of points.
 *
 * @param {Points} points - The set of points.
 * @param {AppConfig} config - The configuration object.
 * @return {LineSegments} The line segments connecting the closest points.
 */
export const createLinesBetweenClosestPoints = (
  points: Points,
  config: AppConfig,
): LineSegments => {
  // Get the positions of the points
  const positions = points.geometry.attributes.position.array;
  // Calculate the number of points
  const numPoints = positions.length / 3;

  // Initialize an empty array to store the vertices of the line segments
  const vertices = [];
  for (let i = 0; i < numPoints; i++) {
    let x1 = positions[i * 3];
    let y1 = positions[i * 3 + 1];
    let z1 = positions[i * 3 + 2];

    // Initialize variables to store the minimum distance and closest point index
    let minDist = Infinity;
    let closestPointIndex;

    // Skip the current point
    for (let j = 0; j < numPoints; j++) {
      if (j !== i) {
        // Get the coordinates of the current point
        let x2 = positions[j * 3];
        let y2 = positions[j * 3 + 1];
        let z2 = positions[j * 3 + 2];

        // Calculate the distance between the two points
        let dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

        // Update the minimum distance and closest point index if the new distance is smaller
        if (dist < minDist) {
          minDist = dist;
          closestPointIndex = j;
        }
      }
    }

    // Check if the minimum distance is within the maximum distance defined in the config and if a closest point index has been found
    if (minDist <= config.MAX_DISTANCE && closestPointIndex != null) {
      // Add the coordinates of the current point and closest point to the vertices array
      vertices.push(
        x1,
        y1,
        z1,
        positions[closestPointIndex * 3],
        positions[closestPointIndex * 3 + 1],
        positions[closestPointIndex * 3 + 2],
      );
    }
  }

  // Create a new buffer geometry for the line segments
  const lineGeometry = new BufferGeometry();
  // Set the position attribute of the line geometry using the vertices array
  lineGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(vertices, 3),
  );

  // Create and return a new LineSegments object using the line geometry and material
  return new LineSegments(
    lineGeometry,
    new LineBasicMaterial({
      color: config.PRIMARY_COLOR,
      fog: true,
      blending: AdditiveBlending,
      transparent: true,
      opacity: config.LIGHTNESS,
    }),
  );
};

/**
 * Sets up lines between the closest points in the scene.
 *
 * @param {Object3D} scene - The scene object where the lines will be added.
 * @param {AppConfig} config - The configuration object for setting up the lines.
 * @return {any} The lines that have been added to the scene.
 */
export const setupLines = (scene: Object3D, config: AppConfig): any => {
  const points: Points = scene.userData.points;
  const lines = createLinesBetweenClosestPoints(points, config);
  scene.add(lines);

  return lines;
};

/**
 * Generates an array of ring objects and adds them to the scene.
 *
 * @param {Object3D} scene - The scene to add the rings to.
 * @param {AppConfig} config - The configuration object for the rings.
 * @return {Array<LineSegments>} An array of LineSegments representing the rings.
 */
export const setupRings = (scene: Object3D, config: AppConfig) => {
  // Generate a random coverage factor between 0.1 and 0.5
  const coverageFactor = 0.1 + Math.random() * 0.4;
  // Declare ringMaterial variable
  let ringMaterial;

  // Create an array of LineSegments representing the rings
  return Array.from({ length: config.RING_COUNT }, (_, index) => {
    // Define the number of hexagons in each ring
    const hexagonCount = 30;
    // Create a Float32Array to store the ring positions
    const ringPositions = new Float32Array(hexagonCount * config.SIDES * 3);

    // Generate the ring positions
    for (let h = 0; h < hexagonCount; h++) {
      for (let i = 0; i < config.SIDES; i++) {
        // Generate a random radius between 15 and 19
        const radius = 15 + Math.random() * 4;
        // Calculate the polar angle based on the index and coverage factor
        const polarAngle =
          (i / config.SIDES + h / hexagonCount) * Math.PI * 2 * coverageFactor;
        // Calculate the azimuthal angle based on the index and configuration
        const azimuthalAngle =
          index > 6
            ? Math.PI / 2 + (Math.random() - config.LIGHTNESS) * 0.05
            : Math.PI / 3;
        // Set the spherical coordinates
        tempSpherical.set(radius, polarAngle, azimuthalAngle);
        // Convert the spherical coordinates to Cartesian coordinates
        tempVector.setFromSpherical(tempSpherical);
        // Set the ring position in the ringPositions array
        ringPositions.set(
          [tempVector.x, tempVector.y, tempVector.z],
          (h * config.SIDES + i) * 3,
        );
      }
    }

    // Create a BufferGeometry for the ring
    let ringGeometry = new BufferGeometry();
    // Set the position attribute of the ring geometry
    ringGeometry.setAttribute(
      "position",
      new BufferAttribute(ringPositions, 3),
    );

    // Create a LineBasicMaterial for the ring
    ringMaterial = new LineBasicMaterial({
      color: config.PRIMARY_COLOR,
      opacity: 0.2,
      blending: AdditiveBlending,
      transparent: true,
    });
    // Set the color of the ring material based on the configuration
    ringMaterial.color.setHSL(config.HUE, config.SATURATION, config.LIGHTNESS);
    // Create a LineSegments object with the ring geometry and material
    const lines = new LineSegments(ringGeometry, ringMaterial);
    // Rotate the lines around the z-axis
    lines.rotation.z += 14.9;
    // Add the lines to the scene
    scene.add(lines);

    return lines;
  });
};

/**
 * Adds a light to the scene with the specified color and position.
 *
 * @param {Object3D} scene - The scene to add the light to.
 * @param {number} h - The hue value of the light color.
 * @param {number} s - The saturation value of the light color.
 * @param {number} l - The lightness value of the light color.
 * @param {Texture} textureFlare0 - The texture for the first lensflare element.
 * @param {AppConfig} config - The application's configuration.
 * @return {PointLight} The newly created point light.
 */
export const addLight = (
  scene: Object3D,
  h: number,
  s: number,
  l: number,
  textureFlare0: Texture,
  config: AppConfig,
): PointLight => {
  const light = new PointLight(0xffffff, 1, 2000, 0);
  light.color.setHSL(h, s, l);
  light.position.set(0, 0, 0);
  scene.add(light);

  const lensflare = new Lensflare();
  lensflare.addElement(
    new LensflareElement(textureFlare0, config.COLORS, 5, light.color),
  );
  lensflare.addElement(
    new LensflareElement(textureFlare0, config.COLORS, 5, light.color),
  );

  light.add(lensflare);

  light.userData.lensflare = lensflare;

  return light;
};
