'use client';

import { useState } from "react";

export default function ManagePromotions() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#222",
    color: "white",
    width: "100%"
  };

  return (
    <div>
      <h1 style={{ color: "#FFCC00" }}>Manage Promotions</h1>

      <div style={{ marginTop: "30px", maxWidth: "400px" }}>
        <label>Promo Code</label>
        <input
          style={inputStyle}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <label style={{ marginTop: "20px", display: "block" }}>
          Discount %
        </label>
        <input
          style={inputStyle}
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <button
          style={{
            background: "#FFCC00",
            color: "black",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            marginTop: "20px"
          }}
        >
          Add Promotion
        </button>
      </div>
    </div>
  );
}