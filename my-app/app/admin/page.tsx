'use client';

export default function Admin() {
  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    background: "#FFCC00",
    color: "black",
    border: "none",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s ease-in-out"
  };

  const cardStyle: React.CSSProperties = {
    background: "#111",
    padding: "50px",
    borderRadius: "16px",
    width: "420px",
    boxShadow: "0 0 25px rgba(255, 204, 0, 0.15)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black"
      }}
    >
      <section style={cardStyle}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#FFCC00",
            letterSpacing: "2px"
          }}
        >
          ADMIN PORTAL
        </h2>

        <button style={buttonStyle}>Manage Movies</button>
        <button style={buttonStyle}>Manage Promotions</button>
        <button style={buttonStyle}>Manage Users</button>
        <button style={buttonStyle}>Manage Showtimes</button>
      </section>
    </div>
  );
}