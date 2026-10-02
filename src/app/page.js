import DemoSection from '../components/DemoSection';
import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
    <div>
      <section className="home-hero">
        <div className="film-fade">
          <p className="eyebrow mb-6"><span className="status-dot" /> SMALL DETAILS. BIG DIFFERENCE.</p>
          <h1 className="display-title">Every word.<br /><em>Worth seeing.</em></h1>
          <p className="hero-description">Turn your video into something everyone can follow. Automatic captions, your finishing touch.</p>
          <div className="mt-8"><UploadForm /></div>
          <p className="mt-5 text-xs text-[var(--ink-muted)]">Free to use <span className="mx-2" aria-hidden="true">·</span> No account needed</p>
        </div>
        <div className="film-fade-late"><DemoSection /></div>
      </section>
      <section className="workflow" aria-label="How it works">
        {[
          ['01', 'Drop into the story.', 'Choose a video. We’ll pick up the words.'],
          ['02', 'Make it sound like you.', 'Fine-tune the text, timing, and colors.'],
          ['03', 'Ready for the world.', 'Apply your captions and save your video.'],
        ].map(([number, title, description]) => (
          <div key={number}><span className="eyebrow">{number}</span><h2>{title}</h2><p>{description}</p></div>
        ))}
      </section>
    </div>
  );
}
