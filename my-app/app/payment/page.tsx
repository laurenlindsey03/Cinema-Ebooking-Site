"use client";

export default function Payment() {
  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Payment Page</h2>
        <p>This is a mock payment processing screen.</p>
        <p>Final payment integration will be implemented in the final demo.</p>
      </section>
    </div>
  );
}

const pageStyle = {
  minHeight: "85vh",
  background: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const cardStyle = {
  background: "#111",
  padding: 40,
  borderRadius: 16,
  width: 400,
  color: "white"
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  textAlign: "center"
};