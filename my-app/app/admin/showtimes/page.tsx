"use client";

import { useEffect, useState } from "react";

const MOVIE_API = "http://localhost:8080/api/movies";
const ADMIN_SHOWTIME_API = "http://localhost:8080/admin/showtimes";

const TIME_OPTIONS = [
  { label: "3:00 PM", value: "15:00:00" },
  { label: "5:00 PM", value: "17:00:00" },
  { label: "8:00 PM", value: "20:00:00" }
];

const HALL_OPTIONS = ["Hall 1", "Hall 2", "Hall 3"];

export default function AdminShowtimes() {
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hallName, setHallName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(MOVIE_API)
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error(err));
  }, []);

  async function addShowtime() {
    if (!selectedMovie || !date || !time || !hallName) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch(ADMIN_SHOWTIME_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovie,
          date: date,
          time: time,
          hallName: hallName
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage("That hall already has a movie scheduled at that time.");
        return;
      }

      setMessage("Showtime added successfully.");
      setDate("");
      setTime("");
      setHallName("");

    } catch (error) {
      console.error(error);
      setMessage("Error adding showtime.");
    }
  }

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Add Showtime</h2>

        {/* Movie Dropdown */}
        <label>Movie</label>
        <select
          value={selectedMovie ?? ""}
          onChange={(e) => setSelectedMovie(Number(e.target.value))}
          style={inputStyle}
        >
          <option value="">Select Movie</option>
          {movies.map(movie => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>

        {/* Date */}
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        {/* Time Dropdown */}
        <label>Time</label>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Time</option>
          {TIME_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Hall Dropdown */}
        <label>Hall</label>
        <select
          value={hallName}
          onChange={(e) => setHallName(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Hall</option>
          {HALL_OPTIONS.map(hall => (
            <option key={hall} value={hall}>
              {hall}
            </option>
          ))}
        </select>

        <button style={buttonStyle} onClick={addShowtime}>
          Save Showtime
        </button>

        {message && (
          <p style={{ marginTop: 10, color: "#FFCC00" }}>
            {message}
          </p>
        )}
      </section>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "85vh",
  background: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const cardStyle: React.CSSProperties = {
  background: "#111",
  padding: 40,
  borderRadius: 16,
  width: 500,
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: 15
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  textAlign: "center"
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#222",
  color: "white"
};

const buttonStyle: React.CSSProperties = {
  marginTop: 10,
  padding: 12,
  background: "#FFCC00",
  color: "black",
  border: "none",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer"
};