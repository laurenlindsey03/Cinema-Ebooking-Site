"use client";

import { useParams } from "next/navigation";
import { movies } from "@/data/movies";
import Link from "next/link";

export default function MovieDetails() {
  const { id } = useParams();

  const movie = movies.find(
    (m) => m.id === Number(id)
  );

  if (!movie) {
    return <p>Movie not found</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      
      <h1>{movie.title}</h1>

      <img
        src={movie.posterUrl}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      <p><strong>Rating:</strong> {movie.rating}</p>
      <p>{movie.description}</p>

      <h2>Showtimes</h2>

      {/* Loop through showings */}
      {movie.showings.map((showing) => (
        <div key={showing.date} style={{ marginBottom: "10px" }}>
          
          <div style={{ fontWeight: 600 }}>
            {showing.date}
          </div>

          {showing.times.map((time) => (
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
        src={movie.trailerUrl}
        allowFullScreen
      />

    </div>
  );
}
