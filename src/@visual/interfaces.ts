export interface ColorConfig {
  PRIMARY_COLOR: number;
  DARK_COLOR: number;
  DARKER_COLOR: number;
  HUE: number;
  SATURATION: number;
  LIGHTNESS: number;
  COLORS: number;
}

export interface AnimationConfig {
  ANIMATION_SPEED: number;
  animationFrameId: number | null;
  opacityFrameId: number | null;
  breatheDirection: number;
  breatheSize: number;
  circleBreatheDirection: number;
  circleBreatheSize: number;
}

export interface ShapeConfig {
  RING_COUNT: number;
  SIDES: number;
  POINTS: number;
  MAX_DISTANCE: number;
}

export interface AppConfig extends ColorConfig, AnimationConfig, ShapeConfig {}
