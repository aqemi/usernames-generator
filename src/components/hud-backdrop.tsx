import { MatrixRain } from '@/components/matrix-rain';
import { RisingParticles } from '@/components/rising-particles';

// Full-bleed hacker-HUD dressing: matrix rain, rising particles, grid
// overlay and scanlines, framing the page like a Stellaron Hunter terminal.
export function HudBackdrop() {
  return (
    <>
      <MatrixRain />
      <RisingParticles />
      <div className="hud-grid" aria-hidden="true" />
      <div className="hud-scanlines" aria-hidden="true" />
    </>
  );
}
