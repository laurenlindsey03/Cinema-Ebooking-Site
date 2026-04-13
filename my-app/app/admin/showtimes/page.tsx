'use client';

import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
};

type Showtime = {
  id: number;
  startTime: string;
  hallName: string;
};

const MOVIE_API = "http://localhost:8080/api/movies";
const SHOWTIME_API = "http://localhost:8080/api/showtimes";

export default function ManageShowtimes() {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Record<number, Showtime[]>>({});
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [hallName, setHallName] = useState("");

  useEffect(() => {
    fetch(MOVIE_API)
      .then(res => res.json())
      .then(data => {
        setMovies(data);

        data.forEach((movie: Movie) => {
          fetch(`${SHOWTIME_API}/movie/${movie.id}`)
            .then(res => res.json())
            .then(st => {
              setShowtimes(prev => ({
                ...prev,
                [movie.id]: st
              }));
            })
            .catch(err => console.error(err));
        });
      })
      .catch(err => console.error(err));
  }, []);

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#222",
    color: "white",
    width: "100%",
    marginTop: "6px"
  };

  const buttonStyle: React.CSSProperties = {
    background: "#FFCC00",
    color: "black",
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px",
    fontWeight: 600
  };

  const handleAddShowtime = async (movieId: number) => {
    if (!newDate || !newTime || !hallName) {
      alert("All fields required.");
      return;
    }

    const startDateTime = `${newDate}T${newTime}:00`;

    try {
      const response = await fetch(SHOWTIME_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          movie: { id: movieId },
          startTime: startDateTime,
          hallName: hallName
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create showtime");
      }

      const createdShowtime = await response.json();

      setShowtimes(prev => ({
        ...prev,
        [movieId]: [...(prev[movieId] || []), createdShowtime]
      }));

      setNewDate("");
      setNewTime("");
      setHallName("");
      setSelectedMovieId(null);

    } catch (error) {
      console.error(error);
      alert("Error adding showtime.");
    }
  };

  return (
    <div>
      <h1 style={{ color: "#FFCC00", fontSize: "26px" }}>
        Manage Showtimes
      </h1>

      <div style={{ marginTop: "40px" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              background: "#111",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "30px",
              boxShadow: "0 0 20px rgba(255,204,0,0.1)"
            }}
          >
            <h2 style={{ color: "#FFCC00" }}>{movie.title}</h2>

            {/* Existing Showtimes */}
            <div style={{ marginTop: "15px" }}>
              {showtimes[movie.id]?.length ? (
                showtimes[movie.id].map((st) => (
                  <p key={st.id} style={{ color: "#ddd" }}>
                    {new Date(st.startTime).toLocaleDateString()} —{" "}
                    {new Date(st.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}{" "}
                    ({st.hallName})
                  </p>
                ))
              ) : (
                <p style={{ color: "#aaa" }}>No showtimes.</p>
              )}
            </div>

            {/* Add Showtime Form */}
            {selectedMovieId === movie.id ? (
              <div style={{ marginTop: "20px", maxWidth: "300px" }}>

                <label>Date</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />

                <label style={{ marginTop: "15px", display: "block" }}>
                  Time
                </label>
                <input
                  type="time"
                  style={inputStyle}
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />

                <label style={{ marginTop: "15px", display: "block" }}>
                  Hall Name
                </label>
                <input
                  type="text"
                  placeholder="Hall 1"
                  style={inputStyle}
                  value={hallName}
                  onChange={(e) => setHallName(e.target.value)}
                />

                <button
                  style={buttonStyle}
                  onClick={() => handleAddShowtime(movie.id)}
                >
                  Save Showtime
                </button>
              </div>
            ) : (
              <button
                style={buttonStyle}
                onClick={() => setSelectedMovieId(movie.id)}
              >
                Add Showtime
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}