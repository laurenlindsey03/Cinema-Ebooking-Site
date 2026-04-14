'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Movie } from "../types/Movie";

type Props = {
  movies: Movie[];
};

export default function MovieCarousel({ movies }: Props) {
  const [current, setCurrent] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavoriteIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  if (!movies || movies.length === 0) {
    return (
      <div style={{ color: "#aaa", textAlign: "center" }}>
        No movies available
      </div>
    );
  }

  const movie = movies[current];

  async function addFavorite() {
    if (!userId) {
      alert("Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/favorites/${userId}/${movie.id}`,
        { method: "POST" }
      );

      if (response.ok) {
        const updated = [...favoriteIds, movie.id!];
        setFavoriteIds(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
      } else {
        alert("Already in favorites.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding favorite.");
    }
  }

  return (
    <div style={containerStyle}>
      <Link href={`/movie/${movie.id}`}>
        <img
          src={movie.posterUrl || "/images/default.jpg"}
          alt={movie.title}
          style={imageStyle}
        />
      </Link>

      <div style={titleStyle}>
        {movie.title}
      </div>

      {userId && (
        <button
          onClick={addFavorite}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "22px",
            color: favoriteIds.includes(movie.id!) ? "red" : "white"
          }}
        >
          {favoriteIds.includes(movie.id!) ? "❤️" : "🤍"}
        </button>
      )}

      <div style={{ marginTop: 15 }}>
        <button
          onClick={() =>
            setCurrent(current === 0 ? movies.length - 1 : current - 1)
          }
          style={navButton}
        >
          Previous
        </button>

        <button
          onClick={() =>
            setCurrent(current === movies.length - 1 ? 0 : current + 1)
          }
          style={navButton}
        >
          Next
        </button>
      </div>

      <div style={{ color: "#888", marginTop: 10 }}>
        {current + 1} / {movies.length}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
  padding: 20,
};

const imageStyle: React.CSSProperties = {
  width: "300px",
  height: "450px",
  borderRadius: 12,
  objectFit: "cover",
  cursor: "pointer",
  boxShadow: "0 8px 25px rgba(0,0,0,0.5)"
};

const titleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 20,
  color: "white",
  textAlign: "center"
};

const navButton: React.CSSProperties = {
  background: "#E50914",
  color: "white",
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  margin: "0 8px",
};