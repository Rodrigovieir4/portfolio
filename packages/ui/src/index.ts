/** Superficie publica do design system. */

export { cn } from './cn';

export { Reveal, RevealGroup, RevealItem, type RevealProps } from './components/reveal';
export { SplitText, ScrambleText, type SplitTextProps } from './components/text';
export { Magnetic, Cursor, TiltCard } from './components/interactive';
export {
  Badge,
  StatusDot,
  SectionHeading,
  Counter,
  Marquee,
  ScrollProgress,
  Grain,
  type BadgeProps,
} from './components/primitives';
export { SmoothScroll, useLenis } from './components/smooth-scroll';

export { GithubIcon, LinkedinIcon, WhatsappIcon } from './components/icons';
export { useMediaQuery, FINE_POINTER } from './use-media-query';
