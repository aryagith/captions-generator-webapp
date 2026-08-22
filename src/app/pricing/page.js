export default function PricingPage() {
  return (
    <div className="pb-16 pt-4">
      <section className="text-center mb-10">
        <p
          className="film-kicker mb-2 text-base sm:text-lg text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-kicker), Georgia, serif' }}
        >
          simple & free
        </p>
        <h1
          className="film-title text-4xl sm:text-5xl font-bold text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          Pricing
        </h1>
        <p className="mt-3 text-[var(--ink-muted)] max-w-md mx-auto text-sm sm:text-base">
          You don&apos;t even need to login. Enjoy unlimited access for free.
        </p>
      </section>

      <div className="flex justify-center">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 w-full max-w-sm text-center shadow-lg shadow-black/10">
          <h2 className="text-lg font-semibold mb-2 text-[var(--ink)]">
            Current plan
          </h2>
          <p className="text-3xl font-bold mb-6 text-[var(--ink)]">
            $0 <span className="text-base font-normal opacity-70">/month</span>
          </p>
          <ul className="text-left space-y-2 text-sm text-[var(--ink-muted)] mb-6">
            <li>Unlimited access</li>
            <li>All features included</li>
            <li>Email support</li>
          </ul>
          <p className="text-sm text-[var(--ink-muted)]">
            More pricing options will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
