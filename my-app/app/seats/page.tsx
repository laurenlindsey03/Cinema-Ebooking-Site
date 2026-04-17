"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Seats() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [maxSeats, setMaxSeats] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookingData") || "{}");
    setMaxSeats(data.adult + data.child + data.senior);
  }, []);

  const seats = Array.from({ length: 30 }, (_, i) => `A${i + 1}`);
  const bookedSeats = ["A3", "A7", "A15"]; // fake demo data

  function toggleSeat(seat: string) {
    if (bookedSeats.includes(seat)) return;

    if (selected.includes(seat)) {
      setSelected(selected.filter(s => s !== seat));
    } else {
      if (selected.length >= maxSeats) return;
      setSelected([...selected, seat]);
    }
  }

  function goToCheckout() {
    if (selected.length !== maxSeats) {
      alert("Select correct number of seats.");
      return;
    }

    localStorage.setItem("selectedSeats", JSON.stringify(selected));
    router.push("/checkout");
  }

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Select Seats</h2>

        <div style={gridStyle}>
          {seats.map(seat => (
            <div
              key={seat}
              onClick={() => toggleSeat(seat)}
              style={{
                ...seatStyle,
                background:
                  bookedSeats.includes(seat)
                    ? "#555"
                    : selected.includes(seat)
                    ? "#FFCC00"
                    : "#222",
                cursor: bookedSeats.includes(seat) ? "not-allowed" : "pointer"
              }}
            >
              {seat}
            </div>
          ))}
        </div>

        <button style={primaryButton} onClick={goToCheckout}>
          Proceed to Checkout
        </button>
      </section>
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
  width: 500,
  color: "white"
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  textAlign: "center"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: 10,
  marginTop: 20,
  marginBottom: 20
};

const seatStyle: React.CSSProperties = {
  padding: 10,
  textAlign: "center",
  borderRadius: 6
};

const primaryButton = {
  width: "100%",
  padding: 12,
  background: "#FFCC00",
  color: "black",
  border: "none",
  borderRadius: 8,
  fontWeight: "bold",
  cursor: "pointer"
};