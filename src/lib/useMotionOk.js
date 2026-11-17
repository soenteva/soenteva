import { useReducedMotion } from "motion/react";

// True when animations may run: the visitor has not asked for reduced motion.
// (Also off in a very old browser without the media query: useReducedMotion then returns null.)
export const useMotionOk = () => !useReducedMotion();

// Scroll reveal needs IntersectionObserver (not in the test DOM); without it content is simply shown.
export const canObserve = () => typeof window !== "undefined" && "IntersectionObserver" in window;
