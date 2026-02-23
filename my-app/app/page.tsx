"use client";

import { useEffect, useState } from "react";
import { Movie } from "./types/Movie";
import MovieCarousel from "./components/MovieCarousel";

const API_BASE = "http://localhost:8080/api/movies";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

   useEffect(() => {
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error(err));
  }, []);

  let results = movies;

  if (search !== "") {
    results = results.filter(movie =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (genre !== "") {
    results = results.filter(movie =>
      movie.category === genre
    );
  }

  if (date !== "") {
    results = results.filter(movie =>
      movie.showtimes?.some(show =>
        new Date(show.start).toISOString().split("T")[0] === date
      )
    );
  }

  if (time !== "") {
    results = results.filter(movie =>
      movie.showtimes?.some(show =>
        new Date(show.start).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        }) === time
      )
    );
  }

  const showingNow = results.filter(
    movie => movie.status === "NOW_PLAYING"
  );

  const comingSoon = results.filter(
    movie => movie.status === "COMING_SOON"
  );

  const genres = [...new Set(movies.map(m => m.category))];
  const dates = [
    ...new Set(
      movies
        .flatMap(m => m.showtimes ?? [])
        .map(s => new Date(s.start).toISOString().split("T")[0])
    )
  ];

  const times = [
    ...new Set(
      movies
        .flatMap(m => m.showtimes ?? [])
        .map(s =>
          new Date(s.start).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
          })
        )
    )
  ];

  return (
    <div style={{ padding: 20 }}>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>

        <input
          type="text"
          placeholder="Search by title..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map(g => <option key={g}>{g}</option>)}
        </select>

        <select onChange={(e) => setDate(e.target.value)}>
          <option value="">All Dates</option>
          {dates.map(d => <option key={d}>{d}</option>)}
        </select>

        <select onChange={(e) => setTime(e.target.value)}>
          <option value="">All Times</option>
          {times.map(t => <option key={t}>{t}</option>)}
        </select>

      </div>

      {results.length === 0 && (
        <p style={{ color: "red" }}>
          No movies match your filters.
        </p>
      )}

      <h2
        style={{
          fontSize: "32px",
          fontWeight: "900",
          letterSpacing: "6px",
          textAlign: "center",
          color: "#e6c26b", 
          textShadow: `
            0 0 4px rgba(230, 194, 107, 0.6),
            0 0 8px rgba(255, 174, 0, 0.4)
          `,
          marginTop: "60px",
          marginBottom: "40px"
        }}
      >
        Now Showing
      </h2>
      <MovieCarousel movies={showingNow} />

      <h2
        style={{
          fontSize: "32px",
          fontWeight: "900",
          letterSpacing: "6px",
          textAlign: "center",
          color: "#e6c26b", 
          textShadow: `
            0 0 4px rgba(230, 194, 107, 0.6),
            0 0 8px rgba(255, 174, 0, 0.4)
          `,
          marginTop: "60px",
          marginBottom: "40px"
        }}
      >
        Coming Soon
      </h2>
      <MovieCarousel movies={comingSoon} />

    </div>
  );
}
