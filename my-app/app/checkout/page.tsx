'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [seats, setSeats] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const bookingData = JSON.parse(localStorage.getItem("bookingData") || "{}");
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");

    setBooking(bookingData);
    setSeats(selectedSeats);

    // Require login
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please login to continue.");
      router.push("/login?redirect=/checkout");
      return;
    }

    setEmail(userEmail);
  }, []);

  if (!booking) return null;

  const adultTotal = booking.adult * 15;
  const childTotal = booking.child * 7;
  const seniorTotal = booking.senior * 10;

  const subtotal = adultTotal + childTotal + seniorTotal;

  function proceedToPayment() {
    if (!email) {
      alert("Email required.");
      return;
    }

    localStorage.setItem("checkoutEmail", email);
    router.push("/payment");
  }

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Order Summary</h2>

        <div style={sectionStyle}>
          <p><strong>Movie:</strong> {booking.movie}</p>
          <p><strong>Showtime:</strong> {new Date(booking.time).toLocaleString()}</p>
          <p><strong>Seats:</strong> {seats.join(", ")}</p>
        </div>

        <div style={sectionStyle}>
          <p>Adult ({booking.adult}) × $15 = ${adultTotal}</p>
          <p>Child ({booking.child}) × $7 = ${childTotal}</p>
          <p>Senior ({booking.senior}) × $10 = ${seniorTotal}</p>
        </div>

        <div style={{ ...sectionStyle, fontWeight: "bold", fontSize: 18 }}>
          Subtotal (Before Tax): ${subtotal}
        </div>

        <div style={sectionStyle}>
          <label>Email Confirmation</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button style={primaryButton} onClick={proceedToPayment}>
          Continue to Payment
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
  textAlign: "center",
  marginBottom: 20
};

const sectionStyle = {
  marginBottom: 20
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 6,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#222",
  color: "white"
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