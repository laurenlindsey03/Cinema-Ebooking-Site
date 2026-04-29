"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login?redirect=/orders");
      return;
    }

    fetch(`http://localhost:8080/api/bookings/history/${userId}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <div style={pageStyle}>
      <h2 style={{ color: "#FFCC00" }}>Order History</h2>

      {orders.length === 0 && <p>No previous bookings.</p>}

      {orders.map((order) => (
        <div key={order.bookingId} style={cardStyle}>
          <p><strong>Confirmation:</strong> {order.confirmationNumber}</p>
          <p><strong>Date:</strong> {new Date(order.bookingDate).toLocaleString()}</p>
          <p><strong>Total:</strong> ${order.totalPrice}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      ))}
    </div>
  );
}

const pageStyle = {
  minHeight: "85vh",
  background: "black",
  color: "white",
  padding: 40
};

const cardStyle = {
  background: "#111",
  padding: 20,
  marginBottom: 20,
  borderRadius: 10
};