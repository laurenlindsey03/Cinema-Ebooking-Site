"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Movie } from "../../types/Movie";
import Link from "next/link";

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState<Movie | null>(null);

  if (!movie) {
    return <p>Movie not found</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      
      <h1>{movie.title}</h1>

      {/* <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{
            width: "300px",
            height: "450px",
            borderRadius: 8,
            cursor: "pointer"
          }}
        /> */}

      <p><strong>Rating:</strong> {movie.mpaaRating}</p>
      <p>{movie.synopsis}</p>

      <h2>Showtimes</h2>

      {movie.showtimes?.map((showing) => (
        <div key={showing.date} style={{ marginBottom: "10px" }}>
          
          <div style={{ fontWeight: 600 }}>
            {showing.date}
          </div>

          {showing.times?.map((time: string) => (
            <Link
              key={time}
              href={`/booking?movie=${movie.title}&time=${time}`}
            >
              <button
                style={{
                  margin: "5px",
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: "#E50914",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                {time}
              </button>
            </Link>
          ))}

        </div>
      ))}

      <h2 style={{ marginTop: "20px" }}>Trailer</h2>

      <iframe
        width="560"
        height="315"
        src={movie.trailer}
        allowFullScreen
      />

    </div>
  );
}
