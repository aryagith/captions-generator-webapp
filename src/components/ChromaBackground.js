export default function ChromaBackground() {
  return (
    <div className="chroma-scene" aria-hidden="true">
      {/* Two soft haze layers only — fewer CSS blurs = smoother scrolling */}
      <div className="chroma-blob">
        <div className="chroma-rim" />
        <div className="chroma-core" />
      </div>
      <div className="chroma-accent chroma-accent-a" />
      <div className="chroma-accent chroma-accent-b" />

      {/* One variable-density fine grain layer */}
      <div className="grain-layer grain-dense" />
      <div className="grain-layer grain-sparse" />
    </div>
  );
}
