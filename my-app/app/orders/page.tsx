"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  bookingId: number;
  confirmationNumber: string;
  bookingDate: string;
  totalPrice: number;
  status: string;
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

        // Handle different possible backend shapes
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.bookings)) {
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
        <p style={{ marginTop: 20 }}>No previous bookings.</p>
      )}

      {Array.isArray(orders) &&
        orders.map((order) => (
          <div key={order.bookingId} style={cardStyle}>
            <p>
              <strong>Confirmation:</strong>{" "}
              {order.confirmationNumber}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.bookingDate).toLocaleString()}
            </p>

            <p>
              <strong>Total:</strong> ${order.totalPrice}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>
        ))}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "85vh",
  background: "black",
  color: "white",
  padding: 40
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  marginBottom: 20
};

const cardStyle: React.CSSProperties = {
  background: "#111",
  padding: 20,
  marginBottom: 20,
  borderRadius: 10,
  border: "1px solid #222"
};