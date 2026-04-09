const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.8 + Math.sin(i) * 7) % 100}%`,
  width: `${8 + (i % 5) * 3}px`,
  height: `${6 + (i % 4) * 2}px`,
  duration: `${6 + (i % 7) * 1.5}s`,
  delay: `${(i * 0.9) % 10}s`,
  color: i % 3 === 0 ? "#ffb7d1" : i % 3 === 1 ? "#ffc8dd" : "#ffaec5",
}));

const SakuraPetals = () => (
  <div className="sakura-container">
    {PETALS.map((p) => (
      <div
        key={p.id}
        className="petal"
        style={{
          left: p.left,
          width: p.width,
          height: p.height,
          background: p.color,
          animationDuration: p.duration,
          animationDelay: p.delay,
          boxShadow: `0 0 4px ${p.color}`,
        }}
      />
    ))}
  </div>
);

export default SakuraPetals;
