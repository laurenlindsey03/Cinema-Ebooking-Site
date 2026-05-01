'use client';

import { useState, useEffect } from "react";

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [message, setMessage] = useState("");
  const [sendingId, setSendingId] = useState<number | null>(null);

  const PROMO_API = "http://localhost:8080/admin/promotions";

  useEffect(() => {
    fetchPromotions();
  }, []);

  async function fetchPromotions() {
    try {
      const response = await fetch(PROMO_API);
      const data = await response.json();
      if (response.ok) {
        setPromotions(data);
      }
    } catch (err) {
      console.error("Failed to fetch promotions", err);
    }
  }

  async function addPromotion() {
    if (!code || !discount || !start || !end) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch(PROMO_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          discount: parseInt(discount, 10), 
          start: start,
          end: end
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error creating promotion.");
        return;
      }

      setMessage("Promotion created and emails sent automatically!");
      setCode("");
      setDiscount("");
      setStart("");
      setEnd("");
      
      fetchPromotions();

    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  }

  async function sendPromoEmail(id: number) {
    setSendingId(id);
    setMessage(""); 
    
    try {
      const response = await fetch(`${PROMO_API}/${id}/send`, {
        method: "POST"
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to send emails.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error sending emails.");
    } finally {
      setSendingId(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#222",
    color: "white",
    width: "100%",
    marginTop: 6
  };

  return (
    <div style={pageStyle}>
      <div style={layoutContainer}>
        
        <div style={cardStyle}>
          <h2 style={titleStyle}>Create Promotion</h2>

          <label>Promo Code</label>
          <input
            style={inputStyle}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <label>Discount (%)</label>
          <input
            type="number"
            style={inputStyle}
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <label>Start Date</label>
          <input
            type="date"
            style={inputStyle}
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <label>End Date</label>
          <input
            type="date"
            style={inputStyle}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />

          <button style={buttonStyle} onClick={addPromotion}>
            Save Promotion
          </button>
        </div>

        <div style={listContainer}>
          <h2 style={titleStyle}>Current Promotions</h2>
          
          {promotions.length === 0 ? (
            <p style={{ color: "#aaa" }}>No promotions currently active.</p>
          ) : (
            <div style={promoScrollList}>
              {promotions.map(promo => (
                <div key={promo.id} style={promoCard}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, color: "#FFCC00" }}>{promo.code}</h3>
                    <p style={{ margin: "4px 0", color: "#ccc", fontSize: "14px" }}>
                      {promo.discount}% Off
                    </p>
                    <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>
                      Valid: {promo.start} to {promo.end}
                    </p>
                  </div>
                  
                  <button 
                    style={sendingId === promo.id ? sendingButtonStyle : emailButtonStyle} 
                    onClick={() => sendPromoEmail(promo.id)}
                    disabled={sendingId === promo.id}
                  >
                    {sendingId === promo.id ? "Sending..." : "Resend"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {message && (
            <div style={messageBox}>
              {message}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


const pageStyle: React.CSSProperties = {
  minHeight: "85vh",
  background: "black",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "50px",
  color: "white"
};

const layoutContainer: React.CSSProperties = {
  display: "flex",
  gap: "30px",
  maxWidth: "900px",
  width: "100%",
  flexWrap: "wrap",
  justifyContent: "center"
};

const cardStyle: React.CSSProperties = {
  background: "#111",
  padding: 30,
  borderRadius: 16,
  width: "350px",
  display: "flex",
  flexDirection: "column",
  gap: 15,
  border: "1px solid #333"
};

const listContainer: React.CSSProperties = {
  background: "#111",
  padding: 30,
  borderRadius: 16,
  width: "450px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #333"
};

const titleStyle: React.CSSProperties = {
  color: "#FFCC00",
  marginBottom: 20,
  fontSize: "22px",
  borderBottom: "1px solid #333",
  paddingBottom: 10
};

const promoScrollList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  maxHeight: "400px",
  overflowY: "auto",
  paddingRight: "10px"
};

const promoCard: React.CSSProperties = {
  background: "#1a1a1a",
  padding: "15px",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #333"
};

const buttonStyle: React.CSSProperties = {
  background: "#FFCC00",
  color: "black",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
  fontWeight: "bold",
  cursor: "pointer"
};

const emailButtonStyle: React.CSSProperties = {
  background: "#00cc66",
  color: "black",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "13px"
};

const sendingButtonStyle: React.CSSProperties = {
  background: "#555",
  color: "#aaa",
  padding: "8px 12px",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "not-allowed",
  fontSize: "13px"
};

const messageBox: React.CSSProperties = {
  marginTop: "20px", 
  padding: "12px", 
  background: "#222", 
  color: "#FFCC00", 
  borderRadius: "8px",
  textAlign: "center",
  border: "1px solid #FFCC00"
};