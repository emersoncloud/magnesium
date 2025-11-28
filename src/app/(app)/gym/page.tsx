import { getBrowserRoutes } from "@/app/actions";
import GymScene from "@/components/gym3d/GymScene";

export const metadata = {
  title: "3D Gym View | Rock Mill",
  description: "Explore the climbing gym in 3D and locate routes on the walls",
};

export default async function GymPage() {
  const routes = await getBrowserRoutes();

  return <GymScene routes={routes} />;
}
