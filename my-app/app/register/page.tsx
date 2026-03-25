'use client';

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from 'react';
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      setError("");

      const formData = new FormData(event.currentTarget);

      const firstName = formData.get("firstName") as string | null;
      const lastName = formData.get("lastName") as string | null;
      const email = formData.get("email") as string | null;
      const password = formData.get("password") as string | null;

      if (!firstName || !lastName || !email || !password) {
        setError("All fields are required.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (response.ok) {
        alert("Registration successful! Please check your email.");
        router.push("/login");
      } else {
        const errorText = await response.text();
        console.log("Registration failed:", errorText);
        setError("Registration failed.");
      }

    } catch (e: any) {
      console.log(e.message);
      setError("Something went wrong.");
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
          width: "420px",
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
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label>First Name</label>
            <input
              name="firstName"
              type="text"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label>Last Name</label>
            <input
              name="lastName"
              type="text"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              required
              style={inputStyle}
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
              cursor: "pointer",
              fontSize: "15px"
            }}
          >
            Sign Up
          </button>
        </form>

        {error && (
          <p style={{ marginTop: "12px", color: "red", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: "25px", fontSize: "14px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#FFCC00" }}>
            Log in
          </Link>
        </p>
      </section>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "6px",
  border: "1px solid #333",
  background: "#222",
  color: "white"
};

export default Register;