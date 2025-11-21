import BestAscents from "./BestAscents";
import GradeChart from "./GradeChart";
import VisitHistory from "./VisitHistory";
import StyleBreakdown from "./StyleBreakdown";

type ActivityLog = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_image: string | null;
  route_id: string | null;
  action_type: string;
  content: string | null;
  created_at: Date | null;
  route_grade: string | null;
  route_color: string | null;
  route_label: string | null;
  wall_id: string | null;
  setter_name: string | null;
  set_date: string | null;
  style: string | null;
  hold_type: string | null;
};

export default function ProfileStats({ activity }: { activity: ActivityLog[] }) {
  return (
    <div>
      <BestAscents activity={activity} />
      <StyleBreakdown activity={activity} />
      <GradeChart activity={activity} />
      <VisitHistory activity={activity} />
    </div>
  );
}
