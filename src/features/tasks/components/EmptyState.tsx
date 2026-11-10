export function EmptyState() {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden
        className="hidden [[data-look=aurora]_&]:block"
      >
        <path d="M70 26a36 36 0 1 0 24 62A30 30 0 0 1 70 26Z" className="fill-accent" />
        <circle cx="28" cy="28" r="3" className="animate-pulse fill-foreground" />
        <circle cx="96" cy="30" r="2.5" className="animate-pulse fill-foreground" />
        <circle cx="100" cy="64" r="2" className="animate-pulse fill-foreground" />
      </svg>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden
        className="hidden [[data-look=candy]_&]:block"
      >
        <path
          d="M34 86a20 20 0 0 1 2-40 26 26 0 0 1 50-4 22 22 0 0 1 0 44Z"
          strokeWidth={4}
          className="fill-card stroke-primary"
        />
        <circle cx="50" cy="62" r="4" className="fill-foreground" />
        <circle cx="72" cy="62" r="4" className="fill-foreground" />
        <path
          d="M52 72q9 8 18 0"
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          className="stroke-foreground"
        />
      </svg>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden
        className="glow hidden rounded-full [[data-look=neon]_&]:block"
      >
        <circle cx="60" cy="60" r="50" fill="none" strokeWidth={3} className="stroke-primary" />
        <polygon points="66,22 38,66 58,66 52,98 82,52 62,52" className="fill-accent" />
      </svg>
      <p className="font-heading text-xl">Keine Aussagen mehr. Zeit für Kaffee.</p>
      <p className="text-muted-foreground">Tippe oben eine neue Aussage ein oder drücke N.</p>
    </div>
  )
}
