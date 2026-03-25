'use client';

import React, { useState, FormEvent } from "react";

export default function ChangePassword() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    const response = await fetch("http://localhost:8080/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    if (response.ok) {
      setMessage("Password changed successfully.");
    } else {
      setMessage("Current password incorrect.");
    }
  }

  return (
    <div style={containerStyle}>
      <section style={cardStyle}>
        <h2 style={headerStyle}>Change Password</h2>

        <form onSubmit={handleSubmit}>
          <input name="currentPassword" type="password" placeholder="Current Password" required style={inputStyle} />
          <input name="newPassword" type="password" placeholder="New Password" required style={inputStyle} />
          <button style={buttonStyle}>Update Password</button>
        </form>

        {message && <p style={{ marginTop: "15px" }}>{message}</p>}
      </section>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "85vh",
  background: "black"
};

const cardStyle = {
  background: "#111",
  padding: "50px",
  borderRadius: "16px",
  width: "400px",
  color: "white"
};

const headerStyle: React.CSSProperties = {
  color: "#FFCC00",
  textAlign: "center",
  marginBottom: "30px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "6px",
  background: "#222",
  color: "white",
  border: "1px solid #333"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#FFCC00",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};