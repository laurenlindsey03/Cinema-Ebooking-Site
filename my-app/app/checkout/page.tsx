"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [seats, setSeats] = useState<string[]>([]);
  const [seatLabels, setSeatLabels] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const bookingData = JSON.parse(localStorage.getItem("bookingData") || "{}");
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats") || "[]");
    const labels = JSON.parse(localStorage.getItem("selectedSeatLabels") || "[]");
    const id = localStorage.getItem("userId");

    if (!id) {
      alert("Please login.");
      router.push("/login?redirect=/checkout");
      return;
    }

    setBooking(bookingData);
    setSeats(selectedSeats);
    setSeatLabels(labels);
    setUserId(id);

    fetch(`http://localhost:8080/api/payments/saved-cards?userId=${id}`)
      .then(res => res.json())
      .then(data => {
        setSavedCards(data);
      })
      .catch((err) => {
        console.error("Failed to fetch cards", err);
        setSavedCards([]);
      });
  }, [router]);

  if (!booking) return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  const subtotal = booking.adult * 15 + booking.child * 7 + booking.senior * 10;

  async function handlePlaceOrder() {
    setIsLoading(true);
    let paymentData = {};
    let paymentRefForHistory = "Card on File"; 

    if (savedCards.length > 0 && selectedCardId) {
      paymentData = { cardId: selectedCardId };
      
      const cardUsed = savedCards.find(c => c.cardId === selectedCardId);
      if (cardUsed) {
        paymentRefForHistory = cardUsed.last4 || cardUsed.cardNumber?.slice(-4) || "Card on File";
      }
      
    } else {
      if (!cardNumber || !expirationDate || !billingAddress) {
        alert("Please complete card information.");
        setIsLoading(false);
        return;
      }

      const formattedExp = expirationDate.includes("-") && expirationDate.length === 7 
          ? `${expirationDate}-01` 
          : expirationDate;

      paymentData = {
        cardNumber,
        expirationDate: formattedExp,
        billingAddress,
        saveCard
      };

      paymentRefForHistory = cardNumber.slice(-4); 

      if (saveCard) {
        try {
          await fetch(`http://localhost:8080/profile/cards/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              encryptedCardNumber: cardNumber, 
              expirationDate: formattedExp,
              billingAddress: billingAddress
            })
          });
        } catch (err) {
          console.error("Failed to save card to profile", err);
        }
      }
    }

    const payload = {
      userId: Number(userId),
      showtimeId: Number(booking.showtimeId), 
      seatIds: seats.map(seat => Number(seat)),
      seatNames: seatLabels,
      adultTickets: booking.adult,
      childTickets: booking.child,
      seniorTickets: booking.senior,
      paymentReference: paymentRefForHistory, 
      ...paymentData
    };

    console.log("Send payload to backend", payload);

    try {
      const response = await fetch("http://localhost:8080/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Checkout failed: " + (data.message || "Unknown error occurred"));
        setIsLoading(false);
        return;
      }

      router.push(`/confirmation?confirmationNumber=${data.confirmationNumber}`);
    } catch (error: any) {
      alert("A network error occurred: " + error.message);
      setIsLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Checkout</h2>

        <div style={sectionStyle}>
          <p><strong>Movie:</strong> {booking.movie}</p>
          <p><strong>Seats:</strong> {seatLabels.length > 0 ? seatLabels.join(", ") : seats.join(", ")}</p>
          <p><strong>Total:</strong> ${subtotal}</p>
        </div>

        <div style={sectionStyle}>
          <h3>Payment Information</h3>

          {savedCards.length > 0 && (
            <>
              {savedCards.map((card) => (
                <div key={card.cardId} style={cardOptionStyle}>
                  <input
                    type="radio"
                    name="card"
                    value={card.cardId}
                    checked={selectedCardId === card.cardId}
                    onChange={() => setSelectedCardId(card.cardId)}
                  />
                  <span>
                    Card ending in {card.last4 || "****"} — 
                    Expires {card.expirationDate?.slice(0,7)}
                  </span>
                </div>
              ))}

              <div style={cardOptionStyle}>
                <input
                  type="radio"
                  name="card"
                  value="new"
                  checked={selectedCardId === null}
                  onChange={() => setSelectedCardId(null)}
                />
                <span>Use a new card</span>
              </div>
            </>
          )}

          {(savedCards.length === 0 || selectedCardId === null) && (
            <>
              <input
                placeholder="Cardholder Name"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={inputStyle}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="month"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  style={inputStyle}
                />
                <input
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <input
                placeholder="Billing Address"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                style={inputStyle}
              />

              <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={() => setSaveCard(!saveCard)}
                />
                Save this card
              </label>
            </>
          )}
        </div>

        <button 
          style={isLoading ? { ...primaryButton, opacity: 0.7 } : primaryButton} 
          onClick={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Place Order"}
        </button>
      </section>
    </div>
  );
}

// Styles
const pageStyle = { minHeight: "85vh", background: "black", display: "flex", justifyContent: "center", alignItems: "center" };
const cardStyle = { background: "#111", padding: 40, borderRadius: 16, width: 500, color: "white" };
const titleStyle: React.CSSProperties = { color: "#FFCC00", textAlign: "center", marginBottom: 20 };
const sectionStyle = { marginBottom: 20 };
const inputStyle = { width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #333", background: "#222", color: "white" };
const primaryButton = { width: "100%", padding: 12, background: "#FFCC00", color: "black", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" };
const cardOptionStyle = { marginBottom: 10, display: "flex", gap: 10, alignItems: "center" };