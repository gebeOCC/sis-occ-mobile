import { Badge } from "@/components/ui/Badge";
import { statusBadge } from "@/lib/assignment";

/** Status pill for any assignment state. "N days left" shows when a deadline is close. */
export function StatusBadge({ assignment, className }) {
  const { label, tone } = statusBadge(assignment);
  return <Badge label={label} tone={tone} className={className} />;
}
