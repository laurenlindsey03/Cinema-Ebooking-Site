"use client";

import { useEffect, useState } from "react";
import { Movie } from "./types/Movie";
import MovieCarousel from "./components/MovieCarousel";

const MOVIE_API = "http://localhost:8080/api/movies";
const SHOWTIME_API = "http://localhost:8080/api/showtimes";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

   useEffect(() => {
    fetch(MOVIE_API)
      .then(res => res.json())
      .then(data => setMovies(data))

    fetch(SHOWTIME_API)
      .then(res => res.json())
      .then(data => setShowtimes(data));
  }, []);

  let results = movies;

  if (search !== "") {
    results = results.filter(movie =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (genre !== "") {
    results = results.filter(movie =>
      movie.categories?.includes(genre)
    );
  }

  if (date !== "") {
    results = results.filter(movie =>
      showtimes.some(st =>
        st.movie?.id === movie.id &&
        new Date(st.startTime).toISOString().split("T")[0] === date
      )
    );
  }

  if (time !== "") {
    results = results.filter(movie =>
      showtimes.some(st =>
        st.movie?.id === movie.id &&
        new Date(st.startTime).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        }) === time
      )
    );
  }


  const showingNow = results.filter(
    movie => movie.status === "NOW_SHOWING" || "NOW_PLAYING"
  );

  const comingSoon = results.filter(
    movie => movie.status === "COMING_SOON"
  );

  const dates = [
    ...new Set(
      showtimes.map(st =>
        new Date(st.startTime).toISOString().split("T")[0]
      )
    )
  ];

  const times = [
    ...new Set(
      showtimes.map(st =>
        new Date(st.startTime).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        })
      )
    )
  ];

  const genres = [
    ...new Set(
      movies.flatMap(m => m.categories ?? [])
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
