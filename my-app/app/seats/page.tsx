"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type DbSeat = {
  id: number;
  seatNumber: string;
  status: "AVAILABLE" | "UNAVAILABLE";
};

export default function Seats() {
  const router = useRouter();
  
  const [dbSeats, setDbSeats] = useState<DbSeat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [maxSeats, setMaxSeats] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("bookingData") || "{}");
    setMaxSeats(data.adult + data.child + data.senior);

    if (data.showtimeId) {
      fetch(`http://localhost:8080/api/showtimes/${data.showtimeId}/seats`)
        .then(res => res.json())
        .then((seatData: any) => {

          if (!Array.isArray(seatData)) {
             console.error("CRASH ALERT! Backend sent this instead of seats:", seatData);
             alert("Backend crashed! Press F12 and check the Console tab to see the error.");
             setLoading(false);
             return; 
          }

          const sortedSeats = seatData.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
          setDbSeats(sortedSeats);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch seats", err);
          setLoading(false);
        });
    } else {
      alert("No showtime selected!");
      router.push("/");
    }
  }, [router]);

  function toggleSeat(seatId: number, status: string) {
    if (status === "UNAVAILABLE") return;

    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds(selectedSeatIds.filter(id => id !== seatId));
    } else {
      if (selectedSeatIds.length >= maxSeats) return;
      setSelectedSeatIds([...selectedSeatIds, seatId]);
    }
  }

  function goToCheckout() {
    if (selectedSeatIds.length !== maxSeats) {
      alert(`Please select exactly ${maxSeats} seats.`);
      return;
    }

    const selectedLabels = selectedSeatIds.map(id => {
      const seat = dbSeats.find(s => s.id === id);
      return seat ? seat.seatNumber : id;
    });

    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeatIds));
    localStorage.setItem("selectedSeatLabels", JSON.stringify(selectedLabels));
    router.push("/checkout");
  }

  if (loading) return <div style={pageStyle}><h2 style={titleStyle}>Loading Seats...</h2></div>;

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Select Seats ({selectedSeatIds.length} / {maxSeats})</h2>

        <div style={screenStyle}>SCREEN</div>

        <div style={gridStyle}>
          {dbSeats.map(seat => {
            const isBooked = seat.status === "UNAVAILABLE";
            const isSelected = selectedSeatIds.includes(seat.id);

            return (
              <div
                key={seat.id}
                onClick={() => toggleSeat(seat.id, seat.status)}
                style={{
                  ...seatStyle,
                  background: isBooked ? "#555" : isSelected ? "#FFCC00" : "#222",
                  color: isSelected ? "black" : "white",
                  cursor: isBooked ? "not-allowed" : "pointer"
                }}
              >
                {seat.seatNumber}
              </div>
            );
          })}
        </div>

        <button style={primaryButton} onClick={goToCheckout}>
          Proceed to Checkout
        </button>
      </section>
    </div>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "85vh", background: "black", display: "flex", justifyContent: "center", alignItems: "center" };
const cardStyle: React.CSSProperties = { background: "#111", padding: 40, borderRadius: 16, width: 600, color: "white" };
const titleStyle: React.CSSProperties = { color: "#FFCC00", textAlign: "center", marginBottom: 20 };
const screenStyle: React.CSSProperties = { background: "#444", color: "#bbb", textAlign: "center", padding: "5px", marginBottom: "30px", borderRadius: "4px", letterSpacing: "5px", fontSize: "12px" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 30 };
const seatStyle: React.CSSProperties = { padding: 10, textAlign: "center", borderRadius: 6, fontWeight: "bold", fontSize: "14px", transition: "0.2s" };
const primaryButton: React.CSSProperties = { width: "100%", padding: 12, background: "#FFCC00", color: "black", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" };