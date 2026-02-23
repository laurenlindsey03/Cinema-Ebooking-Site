"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Movie } from "../types/Movie";

type MovieCarouselProps = {
  movies: Movie[];
};

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (movies.length === 0) {
    return <div>No movies available</div>;
  }

  const movie = movies[current];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: 20
      }}
    >
      <Link href={`/movie/${movie.id}`}>
        <img
          src={movie.trailer?.imageUrl}
          alt={movie.title}
          style={{
            width: "300px",
            height: "450px",
            borderRadius: 8,
            cursor: "pointer"
          }}
        />
      </Link>

      <div
        style={{
          fontWeight: 600,
          fontSize: 18,
          color: "#ffffff"
        }}
      >
        {movie.title}
      </div>

      <div style={{ color: "#bbbbbb" }}>
        {movie.category}
      </div>

      <div>
        <button
          onClick={() =>
            setCurrent(current === 0 ? movies.length - 1 : current - 1)
          }
          style={{
            background: "#E50914",
            color: "#ffffff",
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            margin: "0 8px"
          }}
        >
          Previous
        </button>

        <button
          onClick={() =>
            setCurrent(current === movies.length - 1 ? 0 : current + 1)
          }
          style={{
            background: "#E50914",
            color: "#ffffff",
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            margin: "0 8px"
          }}
        >
          Next
        </button>
      </div>

      <div style={{ color: "#aaaaaa" }}>
        {current + 1} / {movies.length}
      </div>
    </div>
  );
}