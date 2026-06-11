type ApiStatusBannerProps = {
  message: string;
  variant?: "error" | "warning";
};

export function ApiStatusBanner({
  message,
  variant = "error",
}: ApiStatusBannerProps) {
  const styles =
    variant === "error"
      ? "border-priority-critical/40 bg-priority-critical/10 text-priority-critical"
      : "border-priority-medium/40 bg-priority-medium/10 text-priority-medium";

  return (
    <div
      role="alert"
      className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}
    >
      <svg
        className="mt-0.5 h-5 w-5 shrink-0"
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
      <p>{message}</p>
    </div>
  );
}
