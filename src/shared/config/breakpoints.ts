/** Брейкпоинты из bibliya-adaptiva / VIBE-CODING BIBLE */
export const BREAKPOINTS = {
  xs: 0,
  sm: 481,
  md: 601,
  lg: 841,
  xl: 1025,
} as const;

export const MEDIA = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
} as const;

/** Минимальный тач-таргет WCAG / Material */
export const TOUCH_TARGET_MIN = 44;
export const TOUCH_TARGET_CTA = 48;
