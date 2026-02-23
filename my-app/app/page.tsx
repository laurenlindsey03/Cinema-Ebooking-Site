"use client";

import { useEffect, useState } from "react";
import { Movie } from "./types/Movie";
import MovieCarousel from "./components/MovieCarousel";

const API_BASE = "http://localhost:8080";

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
      movie.showtimes?.some(show => show.date === date)
    );
  }

  if (time !== "") {
    results = results.filter(movie =>
      movie.showtimes?.some(show =>
        show.times.includes(time)
      )
    );
  }

  const showingNow = results.filter(
    movie => movie.status === "NOW_SHOWING"
  );

  const comingSoon = results.filter(
    movie => movie.status === "COMING_SOON"
  );

  const genres = [...new Set(movies.map(m => m.category))];
  const dates = [...new Set(
    movies.flatMap(m => m.showtimes?.map(s => s.date))
  )];
  const times = [...new Set(
    movies.flatMap(m => m.showtimes?.flatMap(s => s.times))
  )];

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

      <h2>Currently Running</h2>
      <MovieCarousel movies={showingNow} />

      <h2 style={{ marginTop: 40 }}>Coming Soon</h2>
      <MovieCarousel movies={comingSoon} />

    </div>
  );
}
