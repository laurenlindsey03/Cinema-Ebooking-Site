'use client';

import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      setMessage("Profile updated successfully.");
    } else {
      setMessage("Update failed.");
    }
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "60px 20px",
        background: "black",
        minHeight: "90vh"
      }}
    >
      <section
        style={{
          background: "#111",
          padding: "50px",
          borderRadius: "16px",
          width: "600px",
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
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>First Name</label>
            <input
              value={user.firstName || ""}
              onChange={(e) =>
                setUser({ ...user, firstName: e.target.value })
              }
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Last Name</label>
            <input
              value={user.lastName || ""}
              onChange={(e) =>
                setUser({ ...user, lastName: e.target.value })
              }
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label>Email</label>
            <input
              value={user.email || ""}
              disabled
              style={{
                ...inputStyle,
                background: "#1a1a1a",
                color: "#888"
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
            Save Changes
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: message.includes("success") ? "#00cc66" : "red",
              textAlign: "center"
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: "20px", textAlign: "center" }}>
        <a href="/change-password" style={{ color: "#FFCC00" }}>
            Change Password
        </a>
        </p>

        {/* FAVORITES SECTION */}
        <h3
          style={{
            marginTop: "50px",
            marginBottom: "20px",
            color: "#FFCC00"
          }}
        >
          My Favorite Movies
        </h3>

        {user.favorites && user.favorites.length === 0 && (
          <p style={{ color: "#aaa" }}>No favorite movies yet.</p>
        )}

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            paddingBottom: "10px"
          }}
        >
          {user.favorites?.map((movie: any) => (
            <div
              key={movie.id}
              style={{
                minWidth: "160px",
                textAlign: "center",
                flexShrink: 0
              }}
            >
              <img
                src={movie.posterUrl || "/images/default.jpg"}
                alt={movie.title}
                style={{
                  width: "160px",
                  height: "240px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.6)"
                }}
              />

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  color: "#ddd"
                }}
              >
                {movie.title}
              </p>
            </div>
          ))}
        </div>
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

export default Profile;