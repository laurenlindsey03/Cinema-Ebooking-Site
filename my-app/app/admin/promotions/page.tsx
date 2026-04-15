'use client';

import { useState } from "react";

export default function ManagePromotions() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [message, setMessage] = useState("");

  const PROMO_API = "http://localhost:8080/admin/promotions";

  async function addPromotion() {
    if (!code || !discount || !start || !end) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch(PROMO_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          discount: parseInt(discount, 10), 
          start: start,
          end: end
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error creating promotion.");
        return;
      }

      setMessage("Promotion created successfully!");
      setCode("");
      setDiscount("");
      setStart("");
      setEnd("");

    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#222",
    color: "white",
    width: "100%",
    marginTop: 6
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Manage Promotions</h1>

        <label>Promo Code</label>
        <input
          style={inputStyle}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <label>Discount (%)</label>
        <input
          type="number"
          style={inputStyle}
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <label>Start Date</label>
        <input
          type="date"
          style={inputStyle}
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>End Date</label>
        <input
          type="date"
          style={inputStyle}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <button style={buttonStyle} onClick={addPromotion}>
          Add Promotion
        </button>

        {message && (
          <p style={{ marginTop: 15, color: "#FFCC00" }}>
            {message}
          </p>
        )}
      </div>
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
  width: 450,
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: 15
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  textAlign: "center",
  marginBottom: 10
};

const buttonStyle: React.CSSProperties = {
  background: "#FFCC00",
  color: "black",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
  fontWeight: "bold",
  cursor: "pointer"
};