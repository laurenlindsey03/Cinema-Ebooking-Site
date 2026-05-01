"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Booking() {
  const params = useSearchParams();
  const router = useRouter();

  const movie = params.get("movie");
  const time = params.get("time");
  const showtimeId = params.get("showtimeId");
  const formattedShowtime =
  time &&
  `${new Date(time).toLocaleDateString()} — ${new Date(time).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  })}`;

  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [senior, setSenior] = useState(0);
  const [error, setError] = useState("");

  const totalTickets = adult + child + senior;

  function continueToSeats() {
    if (totalTickets === 0) {
      setError("Select at least one ticket.");
      return;
    }

    localStorage.setItem("bookingData", JSON.stringify({
      showtimeId: showtimeId ? Number(showtimeId) : null,
      movie,
      time,
      adult,
      child,
      senior
    }));

    router.push("/seats");
  }

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Select Tickets</h2>

        <p><strong>Movie:</strong> {movie}</p>
        <p><strong>Showtime:</strong> {formattedShowtime}</p>

        <Ticket label="Adult ($15)" value={adult} set={setAdult} />
        <Ticket label="Child ($7)" value={child} set={setChild} />
        <Ticket label="Senior ($10)" value={senior} set={setSenior} />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={primaryButton} onClick={continueToSeats}>
          Continue to Seat Selection
        </button>
      </section>
    </div>
  );
}

function Ticket({ label, value, set }: any) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label>{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        style={inputStyle}
      />
    </div>
  );
}

const pageStyle = {
  minHeight: "85vh",
  background: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const cardStyle = {
  background: "#111",
  padding: 40,
  borderRadius: 16,
  width: 400,
  color: "white"
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  textAlign: "center"
};

const inputStyle = {
  width: "100%",
  padding: 8,
  marginTop: 6,
  background: "#222",
  color: "white",
  border: "1px solid #333",
  borderRadius: 6
};

const primaryButton = {
  marginTop: 20,
  width: "100%",
  padding: 12,
  background: "#FFCC00",
  color: "black",
  border: "none",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer"
};