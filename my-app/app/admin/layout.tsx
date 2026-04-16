'use client';

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarStyle: React.CSSProperties = {
    width: "220px",
    background: "#111",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    borderRight: "1px solid #222"
  };

  const linkStyle: React.CSSProperties = {
    color: "#FFCC00",
    textDecoration: "none",
    fontWeight: 500
  };

  return (
    <div style={{ display: "flex", minHeight: "85vh", background: "black" }}>
      <aside style={sidebarStyle}>
        <h2 style={{ color: "#FFCC00" }}>ADMIN</h2>

        <Link href="/admin/movies" style={linkStyle}>Manage Movies</Link>
        <Link href="/admin/showtimes" style={linkStyle}>Manage Showtimes</Link>
        <Link href="/admin/promotions" style={linkStyle}>Manage Promotions</Link>
        <Link href="/admin/users" style={linkStyle}>Manage Users</Link>
      </aside>

      <main style={{ flex: 1, padding: "50px", color: "white" }}>
        {children}
      </main>
    </div>
  );
}