import { ChalkLoader } from "@/components/ChalkLoader";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <ChalkLoader size="lg" textContent="Loading..." />
    </div>
  );
}
