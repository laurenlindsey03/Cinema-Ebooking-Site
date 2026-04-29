"use client";

import { useSearchParams } from "next/navigation";

export default function Confirmation() {
  const params = useSearchParams();
  const confirmation = params.get("confirmation");

  return (
    <div style={pageStyle}>
      <h1 style={{ color: "#FFCC00" }}>Order Confirmed!</h1>
      <h2>Your confirmation number:</h2>
      <h3>{confirmation}</h3>
      <p>You will receive a confirmation email shortly.</p>
    </div>
  );
}

const pageStyle = {
  minHeight: "85vh",
  background: "black",
  color: "white",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center"
};