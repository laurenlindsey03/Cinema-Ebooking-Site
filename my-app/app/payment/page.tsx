"use client";

import { CSSProperties, useState } from "react";

export default function Payment() {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState("");

  function handlePayment() {
    if (!name || !cardNumber || !expiry || !cvv || !zip) {
      setMessage("Please complete all payment fields.");
      return;
    }

    setMessage("Payment processing... (Mock Demo Only)");
  }

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Payment Information</h2>

        <label>Cardholder Name</label>
        <input
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Card Number</label>
        <input
          style={inputStyle}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="1234 5678 9012 3456"
        />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Expiration Date</label>
            <input
              type="month"
              style={inputStyle}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>CVV</label>
            <input
              type="password"
              style={inputStyle}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
            />
          </div>
        </div>

        <label>Billing ZIP Code</label>
        <input
          style={inputStyle}
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />

        <button style={primaryButton} onClick={handlePayment}>
          Pay Now
        </button>

        {message && (
          <p style={{ marginTop: 15, color: "#FFCC00", textAlign: "center" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 20, fontSize: 12, color: "#aaa", textAlign: "center" }}>
          This is a mock payment processing screen.
          <br />
          Final integration will be implemented in the final demo.
        </p>
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

const cardStyle: React.CSSProperties = {
  background: "#111",
  padding: 40,
  borderRadius: 16,
  width: 450,
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: 12
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  textAlign: "center",
  marginBottom: 10
};

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #333",
  background: "#222",
  color: "white",
  width: "100%",
  marginTop: 5
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