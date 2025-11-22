import { getRoute, getRouteActivity, getPersonalNote } from "@/app/actions";
import { WALLS } from "@/lib/constants/walls";
import Link from "next/link";
import { ArrowLeft, Star, Calendar, User, Activity, Hash, MapPin, Info, GripHorizontal, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { auth } from "@/lib/auth";
import RouteActivity from "@/components/RouteActivity";
import StarRating from "@/components/StarRating";
import GradeVoting from "@/components/GradeVoting";
import { cn } from "@/lib/utils";
import RouteDetailsView from "@/components/RouteDetailsView";

export default async function RouteDetails({ id }: { id: string }) {
  const route = await getRoute(id);
  if (!route) return <div>Route not found</div>;

  const wall = WALLS.find((w) => w.id === route.wall_id);
  const activity = await getRouteActivity(id);
  const personalNote = await getPersonalNote(id);
  const session = await auth();
  
  const user = session?.user?.email ? {
    id: session.user.id || session.user.email,
    email: session.user.email,
    name: session.user.name || null,
    image: session.user.image || null,
  } : null;

  const myRatingLog = activity.find(a => a.user_id === session?.user?.email && a.action_type === "RATING");
  const myRating = myRatingLog ? parseInt(myRatingLog.content || "0") : 0;

  const ratings = activity.filter(a => a.action_type === "RATING" && a.content).map(a => parseInt(a.content!));
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  const gradeVotes = activity.filter(a => a.action_type === "VOTE" && a.content).map(a => parseInt(a.content!));
  const myVoteLog = activity.find(a => a.user_id === session?.user?.email && a.action_type === "VOTE");
  const myVote = myVoteLog ? parseInt(myVoteLog.content || "0") : null;

  return (
    <RouteDetailsView 
      route={route}
      wall={wall}
      activity={activity}
      personalNote={personalNote || ""}
      user={user}
      avgRating={avgRating}
      ratingsCount={ratings.length}
      myRating={myRating}
      gradeVotes={gradeVotes}
      myVote={myVote}
    />
  );
}
