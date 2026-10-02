import SparklesIcon from './SparklesIcon';

export default function DemoSection() {
  return (
    <section className="demo-stage" aria-label="Before and after captions">
      <div className="demo-card demo-before">
        <div className="demo-label">
          <span>Original</span><span aria-hidden="true">01</span>
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

      <div className="demo-spark" aria-hidden="true">
        <SparklesIcon />
      </div>

      <div className="demo-card demo-after">
        <div className="demo-label">
          <span>With Captioner</span><span aria-hidden="true">02</span>
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
