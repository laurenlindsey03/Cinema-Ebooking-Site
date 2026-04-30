"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Movie } from "../../types/Movie";
import Link from "next/link";

export default function MovieDetails() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);

  const MOVIE_API = "http://localhost:8080/api/movies";
  const SHOWTIME_API = "http://localhost:8080/api/showtimes";

  useEffect(() => {
    if (!id) return;

    fetch(`${MOVIE_API}/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(err => console.error(err));

    fetch(`${SHOWTIME_API}/movie/${id}`)
      .then(res => res.json())
      .then(data => setShowtimes(data))
      .catch(err => console.error(err));

  }, [id]);

  if (!movie) {
    return <p>Movie not found</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      
      <h1 style={{ fontSize: "36px", marginBottom: "10px" , textShadow: `
            0 0 4px rgba(230, 194, 107, 0.6),
            0 0 8px rgba(255, 174, 0, 0.4)
          `,}}>
      {movie.title}
      </h1>


      <img
          src={movie.posterUrl || "/images/WutheringHeights.jpeg"}
          alt={movie.title}
          onError={(e) => {
            console.log("Image failed to load:", movie.posterUrl);
            e.currentTarget.src = "/images/WutheringHeights.jpeg";
          }}
          style={{
            width: "300px",
            height: "450px",
            borderRadius: 8,
            cursor: "pointer"
          }}
        />

      <div style={{ marginBottom: "20px", color: "#bbbbbb" }}>
      {movie.mpaaRating} • {movie.categories?.join(", ")}
      </div>

      <p style={{ lineHeight: "1.6", marginBottom: "30px" }}>
      {movie.synopsis}
      </p>

      <h2
        style={{
          fontSize: "20px",
          fontWeight: "900",
          color: "white", 
          marginBottom: "10px"
        }}
      >
        Showtimes
      </h2>

      {showtimes.map((show) => {
        const dateObj = new Date(show.startTime);

        const formattedDate = dateObj.toLocaleDateString();
        const formattedTime = dateObj.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        });

        return (
          <div key={show.id} style={{ marginBottom: "10px" }}>
            <div style={{ fontWeight: 600 }}>
              {formattedDate}
            </div>

            <Link
              href={`/booking?movie=${encodeURIComponent(movie.title)}&time=${show.startTime}&showtimeId=${show.id}`}
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
                {formattedTime}
              </button>
            </Link>
          </div>
        );
      })} 

      <h2 style={{ marginTop: "20px" }}>Trailer</h2>

      <iframe
        width="560"
        height="315"
        src={movie.trailerUrl.replace("watch?v=", "embed/")}
        allowFullScreen
      />

    </div>
  );
}