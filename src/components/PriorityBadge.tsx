import type { AnomalyPriority } from "@/types/anomaly";

const styles: Record<AnomalyPriority, string> = {
  critical:
    "bg-priority-critical/15 text-priority-critical ring-priority-critical/40",
  high: "bg-priority-high/15 text-priority-high ring-priority-high/40",
  medium:
    "bg-priority-medium/15 text-priority-medium ring-priority-medium/40",
  low: "bg-priority-low/15 text-priority-low ring-priority-low/40",
};

type PriorityBadgeProps = {
  priority: AnomalyPriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
