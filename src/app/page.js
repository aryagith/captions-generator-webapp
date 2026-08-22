import DemoSection from '../components/DemoSection';
import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
    <div className="pb-16">
      <section className="text-center pt-6 sm:pt-12 pb-10">
        <p
          className="film-kicker mb-2 text-base sm:text-lg text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-kicker), Georgia, serif' }}
        >
          captions, beautifully
        </p>
        <h1
          className="film-title text-4xl sm:text-6xl font-bold text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          Captioner
        </h1>
        <p className="mt-4 mx-auto max-w-sm text-sm sm:text-base text-[var(--ink-muted)]">
          Beautiful captions in one upload. Free forever — no login.
        </p>
        <div className="mt-8 flex justify-center">
          <UploadForm />
        </div>
      </section>

      <p className="text-center text-[10px] sm:text-xs tracking-[0.16em] uppercase text-[var(--ink-muted)] mb-4">
        See the difference
      </p>
      <DemoSection />
    </div>
  );
}
