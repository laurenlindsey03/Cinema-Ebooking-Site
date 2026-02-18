"use client";

import { useSearchParams } from "next/navigation";
import Seating from "../components/Seating";

export default function Booking() {
  const params = useSearchParams();
  const movie = params.get("movie");
  const time = params.get("time");

  return (
    <div className="px-10 py-8">
      <h1 className="text-3xl font-bold">Booking</h1>
      <p>Movie: {movie}</p>
      <p>Showtime: {time}</p>

      <div className="mt-6">
        <p>Adult ($15): <input type="number" min="0" /></p>
        <p>Child ($7): <input type="number" min="0" /></p>
        <p>Senior ($10): <input type="number" min="0" /></p>
      </div>

      <Seating />
    </div>
  );
}
