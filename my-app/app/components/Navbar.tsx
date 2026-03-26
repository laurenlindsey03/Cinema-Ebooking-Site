"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.location.href = "/";
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 40px",
        background: "black"
      }}
    >
      <Link
        href="/"
        style={{
          color: "red",
          fontSize: "20px",
          fontWeight: "bold",
          textDecoration: "none"
        }}
      >
        Cinema E-Booking
      </Link>

      <div style={{ display: "flex", gap: "20px" }}>
        {!isLoggedIn ? (
          <>
            <Link href="/login" style={{ color: "white" }}>
              Login
            </Link>
            <Link href="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/profile" style={{ color: "white" }}>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "4px 10px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}