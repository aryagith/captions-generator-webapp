export default function ChromaBackground() {
  return (
    <div className="chroma-scene" aria-hidden="true">
      {/* Soft color via radial gradients only — no CSS filter:blur */}
      <div className="chroma-glow chroma-glow-main" />
      <div className="chroma-glow chroma-glow-a" />
      <div className="chroma-glow chroma-glow-b" />
      <div className="chroma-glow chroma-glow-c" />
    </div>
  );
}
