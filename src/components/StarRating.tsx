"use client";

import { rateRoute } from "@/app/actions";
import { Star } from "lucide-react";
import { useState, useOptimistic } from "react";

export default function StarRating({ routeId, initialRating }: { routeId: string, initialRating: number }) {
  const [rating, setRating] = useState(initialRating);
  const [optimisticRating, setOptimisticRating] = useOptimistic(rating);

  const handleRate = async (value: number) => {
    setOptimisticRating(value);
    setRating(value); // Optimistic update local state
    await rateRoute(routeId, value);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRate(star)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              star <= optimisticRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500 font-medium">
        {optimisticRating > 0 ? `${optimisticRating}/5` : "Rate"}
      </span>
    </div>
  );
}
