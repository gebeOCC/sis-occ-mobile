import { Card } from "@/components/ui/Card";
import { AssignmentRow } from "./AssignmentRow";

/** A single assignment in its own card, for the Tasks and class assignment lists. */
export function AssignmentCard({ assignment }) {
  return (
    <Card className="overflow-hidden p-0">
      <AssignmentRow assignment={assignment} />
    </Card>
  );
}
