'use client';

import React, { FormEvent, useState } from 'react';
import Link from "next/link";

const ForgotPassword = () => {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const response = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Password reset link sent to your email.");
      } else {
        setMessage("Unable to process request.");
      }

    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "85vh",
        background: "black"
      }}
    >
      <section
        style={{
          background: "#111",
          padding: "50px",
          borderRadius: "16px",
          width: "400px",
          boxShadow: "0 0 25px rgba(255, 204, 0, 0.15)",
          color: "white"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#FFCC00",
            letterSpacing: "2px"
          }}
        >
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "25px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                borderRadius: "6px",
                border: "1px solid #333",
                background: "#222",
                color: "white"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#FFCC00",
              color: "black",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: message.includes("sent") ? "#00cc66" : "red"
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "25px", textAlign: "center" }}>
          Back to{" "}
          <Link href="/login" style={{ color: "#FFCC00" }}>
            Login
          </Link>
        </p>
      </section>
    </div>
  );
};

export default ForgotPassword;