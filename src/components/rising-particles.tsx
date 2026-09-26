// Small purple/cyan sparkles drifting upward and fading, matching the
// reference's continuously-spawned .particle elements. Rendered as a fixed
// pool with staggered animation delays instead of interval-driven DOM churn.
const PARTICLES = Array.from({ length: 24 }, (_, i) => {
  const size = 1 + ((i * 37) % 4);
  const left = (i * 41.3) % 100;
  const duration = 8 + ((i * 13) % 10);
  const delay = (i * 0.83) % 8;
  const color = i % 2 === 0 ? 'var(--primary)' : 'var(--cyan)';
  return { size, left, duration, delay, color };
});

export function RisingParticles() {
  return (
    <div className="hud-particles" aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <i
          key={i}
          className="hud-particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
