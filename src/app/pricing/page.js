import Link from 'next/link';

export default function PricingPage() {
  return (
    <section className="max-w-xl mx-auto py-8 sm:py-12 film-fade">
      <p className="eyebrow text-center mb-5">GOOD STORIES SHOULDN’T COST MORE.</p>
      <h1 className="display-title text-center">All the words.<br /><em>None of the fees.</em></h1>
      <p className="text-center text-sm text-[var(--ink-muted)] mt-6 mb-9">Everything you need to caption your next video. No account required.</p>
      <div className="glass-panel rounded-3xl p-7 sm:p-9">
        <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">The everyday plan</h2><span className="small-badge">FREE</span></div>
        <p className="text-6xl tracking-tight mt-7 mb-2">$0<span className="text-sm text-[var(--ink-muted)] tracking-normal ml-2">/ forever</span></p>
        <p className="text-xs text-[var(--ink-muted)] mb-7">For your first video. And the next one.</p>
        <ul className="border-t border-[var(--glass-border)] py-6 space-y-4 text-sm">
          {['Automatic speech transcription', 'Editable captions and timing', 'Custom text and outline colors', 'Captioned video downloads'].map(feature => (
            <li key={feature} className="flex gap-3"><span className="text-[var(--accent)]" aria-hidden="true">✓</span>{feature}</li>
          ))}
        </ul>
        <Link href="/" className="cta-pill primary-button w-full">Make your first caption ↗</Link>
      </div>
    </section>
  );
}
