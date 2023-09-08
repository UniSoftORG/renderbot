import React, { useEffect, useRef } from "react";
import {
  setupScene,
  loadTextures,
  setupParent,
} from "../utils/threeSetupUtils";
import {
  setupParticles,
  setupLines,
  setupRings,
  addLight,
} from "../utils/creationUtils";
import { createRenderLoop } from "../utils/animateUtils";
import { appConfig } from "../config/default.config";

export default function MainComponent() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize scene, camera, and renderer
    const { scene, renderer, camera } = setupScene(sceneRef, 100);

    // Load textures
    const { textureFlare0 } = loadTextures();

    // Initialize and add Parent object to scene
    const parent = setupParent(scene);

    // Create and add sub-elements (Particles, Lines, Rings)
    const points = setupParticles(parent, appConfig);
    const lines = setupLines(parent, appConfig);
    const rings = setupRings(parent, appConfig);
    addLight(parent, 0.55, 0.9, 0.5, textureFlare0, appConfig);

    // Start animation loop
    createRenderLoop(scene, camera, renderer, points, rings, lines);

    // Handle window resizing
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  return <div ref={sceneRef}></div>;
}
