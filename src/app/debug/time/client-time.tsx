"use client";

export function ClientTime({ date }: { date: Date | null }) {
  if (!date) return <div>No date</div>;

  return (
    <div className="mt-2 text-blue-600">
      <div>Client Locale: {date.toLocaleString()}</div>
      <div>Client ISO: {date.toISOString()}</div>
      <div>Time Ago: {timeAgo(date)}</div>
    </div>
  );
}

const timeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  return `${diffInSeconds} seconds ago`;
};
