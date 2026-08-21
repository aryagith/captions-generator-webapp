import SparklesIcon from './SparklesIcon';

export default function DemoSection() {
  return (
    <section className="w-fit max-w-full mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      <div className="glass-panel rounded-2xl p-2.5 w-[150px] sm:w-[180px] shadow-lg shadow-black/10">
        <div className="text-[10px] tracking-[0.12em] uppercase text-[var(--ink-muted)] mb-2 px-1">
          Before
        </div>
        <div className="rounded-xl overflow-hidden aspect-[9/14] bg-black/20">
          <video
            className="w-full h-full object-cover"
            src="https://captioner-video.s3.ca-central-1.amazonaws.com/TikVid.io_7371953577163492613.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>

      <div className="w-9 h-9 shrink-0 rounded-full glass-nav inline-flex items-center justify-center text-[var(--ink)]">
        <SparklesIcon />
      </div>

      <div className="glass-panel rounded-2xl p-2.5 w-[150px] sm:w-[180px] shadow-lg shadow-black/10">
        <div className="text-[10px] tracking-[0.12em] uppercase text-[var(--ink-muted)] mb-2 px-1">
          After
        </div>
        <div className="rounded-xl overflow-hidden aspect-[9/14] bg-black/20">
          <video
            className="w-full h-full object-cover"
            src="https://captioner-video.s3.ca-central-1.amazonaws.com/transcribed.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
