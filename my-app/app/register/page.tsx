'use client';

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from 'react';
import Link from "next/link";

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [receivePromotions, setReceivePromotions] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);

      const formData = new FormData(event.currentTarget);

      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const phoneNumber = formData.get("phoneNumber") as string;
      const password = formData.get("password") as string;

      const street = formData.get("street") as string;
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      const zip = formData.get("zip") as string;
      const cardNumber = formData.get("cardNumber") as string;

      if (!firstName || !lastName || !email || !phoneNumber || !password) {
        setError("All required fields must be filled.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          passwordHash: password,

          // optional (backend will ignore if unused)
          street,
          city,
          state,
          zip,
          cardNumber,

          receivePromotions
        }),
      });

      if (response.ok) {
        alert("Registration successful! Please check your email.");
        router.push("/login");
      } else {
        const errorText = await response.text();
        setError(errorText || "Registration failed.");
      }

    } catch (e: any) {
      console.error(e);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={containerStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <div style={inputGroup}>
            <label>First Name *</label>
            <input name="firstName" type="text" required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Last Name *</label>
            <input name="lastName" type="text" required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Email *</label>
            <input name="email" type="email" required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Phone Number *</label>
            <input name="phoneNumber" type="text" required style={inputStyle} />
          </div>

          <div style={inputGroup}>
            <label>Password *</label>
            <input name="password" type="password" required style={inputStyle} />
          </div>

          <h4 style={{ marginTop: "20px", color: "#FFCC00" }}>
            Address (optional)
          </h4>

          <div style={inputGroup}>
            <input name="street" placeholder="Street" style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <input name="city" placeholder="City" style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <input name="state" placeholder="State" style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <input name="zip" placeholder="Zip Code" style={inputStyle} />
          </div>

          <h4 style={{ marginTop: "20px", color: "#FFCC00" }}>
            Payment (optional)
          </h4>

          <div style={inputGroup}>
            <input name="cardNumber" placeholder="Card Number" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px', marginTop: '15px' }}>
            <input 
              type="checkbox" 
              id="promoCheckbox"
              checked={receivePromotions}
              onChange={(e) => setReceivePromotions(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: "#FFCC00" 
              }}
            />
            <label htmlFor="promoCheckbox" style={{ color: "white", fontSize: "14px", cursor: "pointer" }}>
              Sign up for promotional emails!
            </label>
          </div>

          <button type="submit" style={buttonStyle}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {error && <p style={errorStyle}>{error}</p>}

        <p style={footerText}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#FFCC00" }}>
            Log in
          </Link>
        </p>
      </section>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "85vh",
  background: "black"
};

const cardStyle: React.CSSProperties = {
  background: "#111",
  padding: "50px",
  borderRadius: "16px",
  width: "420px",
  boxShadow: "0 0 25px rgba(255, 204, 0, 0.15)"
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "28px",
  color: "#FFCC00",
  letterSpacing: "2px"
};

const inputGroup: React.CSSProperties = {
  marginBottom: "18px"
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

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#FFCC00",
  color: "black",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px"
};

const errorStyle: React.CSSProperties = {
  marginTop: "12px",
  color: "red",
  fontSize: "14px"
};

const footerText: React.CSSProperties = {
  marginTop: "25px",
  fontSize: "14px",
  textAlign: "center"
};

export default Register;