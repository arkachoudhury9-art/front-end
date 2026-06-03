import Link from "next/link";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AppShell({
  title,
  subtitle,
  children,
  backHref,
  backLabel = "Back to anomalies",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <header className="border-b border-surface-border bg-surface-raised/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted ring-1 ring-accent/40">
              <svg
                className="h-5 w-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Industrial Monitoring
              </p>
              <h1 className="text-lg font-semibold text-white">{title}</h1>
              {subtitle && (
                <p className="text-sm text-slate-400">{subtitle}</p>
              )}
            </div>
          </div>
          {backHref ? (
            <Link
              href={backHref}
              className="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-accent/50 hover:bg-accent-muted hover:text-white"
            >
              ← {backLabel}
            </Link>
          ) : (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
              Live feed
            </span>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
