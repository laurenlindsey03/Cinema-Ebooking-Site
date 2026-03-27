'use client';

import React, { useState, useEffect } from "react";
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

  const posterMap: { [key: string]: string } = {
    "Crime 101": "/images/Crime101.jpeg",
    "GOAT": "/images/Goat.jpg",
    "I Can Only Imagine 2": "/images/ICanOnlyImagine2.jpg",
    "Peaky Blinders: The Immortal Man": "/images/PeakyBlinders.jpeg",
    "Project Hail Mary": "/images/ProjectHailMary.jpeg",
    "Reminders of Him": "/images/RemindersOfHim.jpeg",
    "Send Help": "/images/SendHelp.jpeg",
    "Solo Mio": "/images/SoloMia.jpg",
    "The Bride!": "/images/TheBride!.jpeg",
    "Wuthering Heights": "/images/WutheringHeights.jpeg",
  };

  if (movies.length === 0) return <div>No movies available</div>;

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
        alert("Added to favorites!");

        const updated = [...favoriteIds, movie.id];
        setFavoriteIds(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
      } else {
        const error = await response.text();
        console.log(error);
        alert("Already added or error occurred.");
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
          src={posterMap[movie.title] || "/images/default.jpg"}
          alt={movie.title}
          style={imageStyle}
        />
      </Link>

      <div style={{ fontWeight: 600, fontSize: 18, color: "white" }}>
        {movie.title}
      </div>

      {userId && (
        <button
          onClick={addFavorite}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: favoriteIds.includes(movie.id) ? "red" : "white"
          }}
        >
          {favoriteIds.includes(movie.id) ? "❤️" : "🤍"}
        </button>
      )}

      <div>
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

      <div style={{ color: "#aaa" }}>
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
  borderRadius: 10,
  cursor: "pointer",
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

const favoriteButton: React.CSSProperties = {
  background: "#FFCC00",
  color: "black",
  padding: "6px 14px",
  borderRadius: "20px",
  border: "none",
  fontSize: "13px",
  fontStyle: "italic",
  cursor: "pointer",
};