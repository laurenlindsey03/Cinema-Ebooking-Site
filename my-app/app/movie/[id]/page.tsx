"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Movie } from "../../types/Movie";
import Link from "next/link";

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState<Movie | null>(null);

  const API_BASE = "http://localhost:8080/api/movies";

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((m: Movie) => m.id === id);
        setMovie(found || null);
      })
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

      <div style={{ marginBottom: "20px", color: "#bbbbbb" }}>
      {movie.mpaaRating} • {movie.category}
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

      {movie.showtimes?.map((showing, index) => {
        const dateObj = new Date(showing.start);

        const formattedDate = dateObj.toISOString().split("T")[0];

        const formattedTime = dateObj.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        });

        return (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ fontWeight: 600 }}>
              {formattedDate}
            </div>

            <Link
              href={`/booking?movie=${movie.title}&time=${formattedTime}`}
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
        src={movie.trailer?.videoUrl.replace("watch?v=", "embed/")}
        allowFullScreen
      />

    </div>
  );
}
