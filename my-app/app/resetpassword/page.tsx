'use client';

import { useSearchParams } from "next/navigation";
import React, { useState, FormEvent } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const response = await fetch("http://localhost:8080/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword: password
      })
    });

    if (response.ok) {
      setMessage("Password reset successfully.");
    } else {
      setMessage("Reset failed or token expired.");
    }
  }

  return (
    <div style={{ background: "black", minHeight: "85vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <section style={{ background: "#111", padding: "50px", borderRadius: "16px", width: "400px", color: "white" }}>
        <h2 style={{ color: "#FFCC00", textAlign: "center", marginBottom: "30px" }}>
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            name="password"
            type="password"
            placeholder="New Password"
            required
            style={inputStyle}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            style={inputStyle}
          />

          <button style={buttonStyle}>
            Reset Password
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            {message}
          </p>
        )}
      </section>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  background: "#222",
  color: "white",
  border: "1px solid #333"
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#FFCC00",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};