import type { Assignment } from "@/features/assignments/types";
import { Badge } from "@/components/ui/Badge";
import { statusBadge } from "@/features/assignments/rules";

/** Status pill for any assignment state. "N days left" shows when a deadline is close. */
export function StatusBadge({
  assignment,
  className,
}: {
  assignment: Assignment;
  className?: string;
}) {
  const { label, tone } = statusBadge(assignment);
  return <Badge label={label} tone={tone} className={className} />;
}
