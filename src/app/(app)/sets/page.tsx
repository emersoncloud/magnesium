import SetsPageContent from "@/components/SetsPageContent";

// Client-first page: SetsPageContent will use TanStack Query cache if available,
// otherwise fetch fresh data. This avoids blocking navigation on server fetch.
export default function SetsPage() {
  return <SetsPageContent />;
}
