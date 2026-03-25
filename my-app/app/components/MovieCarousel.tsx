"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Movie } from "../types/Movie";

type MovieCarouselProps = {
  movies: Movie[];
};

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (!movies || movies.length === 0) {
    return <div>No movies available</div>;
  }

  const movie = movies[current];

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

  async function handleAddFavorite() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/favorites/${movie.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        alert("Added to favorites!");
      } else {
        alert("Could not add to favorites.");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding favorite.");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px"
      }}
    >
      {/* Poster */}
      <Link href={`/movie/${movie.id}`}>
        <img
          src={posterMap[movie.title] || "/images/WutheringHeights.jpeg"}
          alt={movie.title}
          style={{
            width: "300px",
            height: "450px",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)"
          }}
        />
      </Link>

      {/* Title */}
      <h3
        style={{
          marginTop: "15px",
          fontSize: "20px",
          color: "white"
        }}
      >
        {movie.title}
      </h3>

      {/* Categories */}
      <p style={{ color: "#bbbbbb", marginBottom: "10px" }}>
        {movie.categories?.join(", ")}
      </p>

      {/* Add to Favorites Button */}
      <button
  onClick={handleAddFavorite}
  style={{
    padding: "6px 14px",
    background: "transparent",
    color: "#FFCC00",
    border: "1px solid #FFCC00",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "cursive",
    letterSpacing: "0.5px",
    marginBottom: "20px",
    transition: "all 0.2s ease"
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.background = "#FFCC00";
    e.currentTarget.style.color = "white";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = "#FFCC00";
  }}
>
  Add to Favorites
</button>

      {/* Navigation Buttons */}
      <div>
        <button
          onClick={() =>
            setCurrent(current === 0 ? movies.length - 1 : current - 1)
          }
          style={{
            background: "#333",
            color: "white",
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Previous
        </button>

        <button
          onClick={() =>
            setCurrent(current === movies.length - 1 ? 0 : current + 1)
          }
          style={{
            background: "#333",
            color: "white",
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer"
          }}
        >
          Next
        </button>
      </div>

      {/* Counter */}
      <p style={{ marginTop: "10px", color: "#aaaaaa" }}>
        {current + 1} / {movies.length}
      </p>
    </div>
  );
}