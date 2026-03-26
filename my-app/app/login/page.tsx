'use client';

import React, { useState, FormEvent } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      setError("");

      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Login failed");
        return;
      }
      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      const id = data.userId || data.id;

      if (!id) {
        setError("Login failed: no user id returned");
        return;
      }

      localStorage.setItem("userId", id.toString());
      localStorage.setItem("role", data.role);

      window.location.href = data.role === "ADMIN" ? "/admin" : "/";

    } catch (e) {
      console.error(e);
      setError("An error occurred");
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
          width: "380px",
          boxShadow: "0 0 25px rgba(255, 204, 0, 0.15)"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "28px",
            color: "#FFCC00",
            letterSpacing: "2px"
          }}
        >
          Welcome Back
        </h2>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>
            <input
              name="email"
              type="email"
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

          <div style={{ marginBottom: "25px" }}>
            <label>Password</label>
            <input
              name="password"
              type="password"
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
            <div style={{ textAlign: "right", marginTop: "6px" }}>
            <Link href="/forgotpassword" style={{ color: "#FFCC00", fontSize: "14px" }}>
                Forgot Password?
            </Link>
            </div>
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
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            Log In
          </button>
        </form>

        {error && (
          <p style={{ marginTop: "12px", color: "red", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: "25px", fontSize: "14px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link href="/register" style={{ color: "#FFCC00" }}>
            Register
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Login;