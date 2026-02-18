"use client";

import { useState } from "react";

export default function Seating() {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const handleSeatClick = (seatNumber: number) => {

    if (selectedSeats.includes(seatNumber)) {
      const updatedSeats = selectedSeats.filter(
        (seat) => seat !== seatNumber
      );
      setSelectedSeats(updatedSeats);
    } 
    
    else {
      const updatedSeats = [...selectedSeats, seatNumber];
      setSelectedSeats(updatedSeats);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Select Seats</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 50px)",  // 6 seats per row
          gap: "10px",
          marginTop: "15px"
        }}
      >
        {[...Array(24)].map((_, index) => {
          const seatNumber = index + 1;
          const isSelected = selectedSeats.includes(seatNumber);

          return (
            <button
              key={seatNumber}
              onClick={() => handleSeatClick(seatNumber)}
              style={{
                height: "50px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: isSelected ? "#E50914" : "#cccccc",
                color: isSelected ? "#ffffff" : "#grey"
              }}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        Selected Seats: {selectedSeats.join(", ") || "None"}
      </div>
    </div>
  );
}

