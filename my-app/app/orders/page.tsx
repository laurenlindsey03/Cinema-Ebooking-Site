"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Ticket = {
  ticketId: number;
  seatNumber?: string;
  seat?: {
    seatNumber: string;
  };
  ticketType?: string; 
};


type Order = {
  bookingId: number;
  confirmationNumber: string;
  bookingDate: string;
  totalPrice: number;
  status: string;
  paymentReference?: string;
  last4?: string; 
  paymentCard?: { 
    last4: string;
  };
  showtime?: {
    startTime: string;
    movie?: {
      title: string;
    };
  };
  tickets?: Ticket[];
};

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login?redirect=/orders");
      return;
    }

    fetch(`http://localhost:8080/api/bookings/history/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders response:", data);

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.bookings)) {
          setOrders(data.bookings);
        } else {
          setOrders([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Orders fetch error:", err);
        setOrders([]);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2 style={titleStyle}>Order History</h2>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Order History</h2>

      {orders.length === 0 && (
        <p style={{ marginTop: 20 }}>No previous bookings found.</p>
      )}

      {Array.isArray(orders) &&
        orders.map((order) => {
          
          let displayPayment = "Card on File";
          if (order.paymentCard?.last4) displayPayment = `**** **** **** ${order.paymentCard.last4}`;
          else if (order.last4) displayPayment = `**** **** **** ${order.last4}`;
          else if (order.paymentReference) displayPayment = `**** **** **** ${order.paymentReference.slice(-4)}`;

          return (
            <div key={order.bookingId} style={cardStyle}>
              <div style={headerStyle}>
                <h3 style={{ margin: 0, color: "#FFCC00" }}>
                  Booking: {order.confirmationNumber}
                </h3>
                <span style={statusBadge(order.status)}>{order.status}</span>
              </div>

              <div style={detailsGrid}>
                <div>
                  <p>
                    <strong>Movie:</strong>{" "}
                    {order.showtime?.movie?.title || "Unknown Movie"}
                  </p>
                  <p>
                    <strong>Showtime:</strong>{" "}
                    {order.showtime?.startTime
                      ? new Date(order.showtime.startTime).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Unknown Time"}
                  </p>
                  <p>
                    <strong>Booked On:</strong>{" "}
                    {new Date(order.bookingDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p>
                    <strong>Total Paid:</strong> ${order.totalPrice?.toFixed(2)}
                  </p>
                  <p>
                    <strong>Payment Ref:</strong> {displayPayment}
                  </p>
                </div>
              </div>

              <div style={ticketSection}>
                <strong style={{ display: "block", marginBottom: 8, color: "#ccc" }}>
                  Tickets & Seats:
                </strong>
                {order.tickets && order.tickets.length > 0 ? (
                  <ul style={ticketList}>
                    {order.tickets.map((ticket, index) => {
                      
                      const niceTicketNumber = ticket.ticketId 
                        ? `TKT-${String(ticket.ticketId).padStart(5, '0')}` 
                        : "N/A";
                      
                      const niceSeat = ticket.seat?.seatNumber || ticket.seatNumber || "Unassigned";

                      return (
                        <li key={ticket.ticketId || index} style={ticketItem}>
                          {niceTicketNumber} — Seat:{" "}
                          <span style={seatBadge}>{niceSeat}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
                    No ticket details available.
                  </p>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "85vh", background: "black", color: "white", padding: "40px 20px", maxWidth: "800px", margin: "0 auto" };
const titleStyle: React.CSSProperties = { color: "#FFCC00", marginBottom: 30, fontSize: "2rem", borderBottom: "1px solid #333", paddingBottom: 10 };
const cardStyle: React.CSSProperties = { background: "#111", padding: 24, marginBottom: 20, borderRadius: 12, border: "1px solid #333", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" };
const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #222", paddingBottom: 12 };
const detailsGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px", fontSize: "15px", lineHeight: "1.6" };
const ticketSection: React.CSSProperties = { background: "#1a1a1a", padding: "16px", borderRadius: "8px" };
const ticketList: React.CSSProperties = { listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" };
const ticketItem: React.CSSProperties = { background: "#222", padding: "8px 12px", borderRadius: "6px", fontSize: "14px", border: "1px solid #333" };
const seatBadge: React.CSSProperties = { background: "#FFCC00", color: "black", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", marginLeft: "4px" };

function statusBadge(status: string): React.CSSProperties {
  const isConfirmed = status === "CONFIRMED" || status === "COMPLETED";
  return {
    background: isConfirmed ? "rgba(0, 204, 102, 0.2)" : "rgba(255, 68, 68, 0.2)",
    color: isConfirmed ? "#00cc66" : "#ff4444",
    padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase",
  };
}