"use client";
import Link from "next/link";

export default function Navbar() {
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
    </nav>
  );
}