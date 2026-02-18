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
        background: "black",
        color: "white",
      }}
      >
      <div style={{color: "red"}}>
        Cinema E-Booking
      </div>
    </nav>
  );
}