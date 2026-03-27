'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const posterMap: { [key: string]: string } = {
  "Crime 101": "/images/Crime101.jpeg",
  "GOAT": "/images/Goat.jpg",
  "I Can Only Imagine 2": "/images/ICanOnlyImagine2.jpg",
  "Peaky Blinders: The Immortal Man": "/images/PeakyBlinders.jpeg",
  "Project Hail Mary": "/images/ProjectHailMary.jpeg",
  "Reminders of Him": "/images/RemindersOfHim.jpeg",
  "Send Help": "/images/SendHelp.jpeg",
  "Solo Mio": "/images/SoloMia.jpg",
  "The Bride!": "/images/TheBride!.jpeg",
  "Wuthering Heights": "/images/WutheringHeights.jpeg",
};

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });

  const [cards, setCards] = useState([
    { encryptedCardNumber: "", expirationDate: "", billingAddress: "" },
    { encryptedCardNumber: "", expirationDate: "", billingAddress: "" },
    { encryptedCardNumber: "", expirationDate: "", billingAddress: "" }
  ]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8080/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));

    fetch(`http://localhost:8080/profile/cards/${userId}`)
      .then(res => res.json())
      .then(cardData => {
        const filled = [
          { encryptedCardNumber: "", expirationDate: "", billingAddress: "" },
          { encryptedCardNumber: "", expirationDate: "", billingAddress: "" },
          { encryptedCardNumber: "", expirationDate: "", billingAddress: "" }
        ];

        if (cardData && cardData.length > 0) {
          cardData.slice(0, 3).forEach((c: any, i: number) => {
            filled[i] = {
              encryptedCardNumber: c.encryptedCardNumber || "",
              expirationDate: c.expirationDate || "",
              billingAddress: c.billingAddress || ""
            };
          });
        }

        setCards(filled);
      });

    fetch(`http://localhost:8080/profile/address/${userId}`)
      .then(res => res.json())
      .then(addr => {
        if (addr) {
          setAddress({
            street: addr.street || "",
            city: addr.city || "",
            state: addr.state || "",
            zip: addr.zip || ""
          });
        }
      });

    fetch(`http://localhost:8080/favorites/${userId}`)
      .then(res => res.json())
      .then(data => setFavorites(data));

  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    const userId = user.userId;

    if (currentPassword || newPassword) {
      if (currentPassword === newPassword) {
        setIsError(true);
        setMessage("New password cannot be the same as the current password.");
        return;
      }
    }

    for (const card of cards) {
      if (card.encryptedCardNumber && card.encryptedCardNumber.trim() !== "") {
        await fetch(`http://localhost:8080/profile/cards/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(card)
        });
      }
    }

    await fetch(`http://localhost:8080/profile/address/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address)
    });

    if (currentPassword && newPassword) {
    const res = await fetch(`http://localhost:8080/users/${user.userId}/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword
      })
    });

    if (!res.ok) {
        setIsError(true);
        try {
          const errorData = await res.json();
          setMessage(errorData.message || "Please provide the correct current password first.");
        } catch (e) {
          setMessage("Please check your current password.");
        }
        return; 
      }
    }

    setMessage("Profile updated successfully.");
  }

  if (!user) {
    return (
      <div style={loadingContainer}>
        <p style={{ color: "white" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <section style={cardStyle}>
        <h2 style={titleStyle}>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div style={inputGroup}>
            <label>First Name *</label>
            <input
              style={inputStyle}
              value={user.firstName || ""}
              onChange={(e) =>
                setUser({ ...user, firstName: e.target.value })
              }
            />
          </div>

          <div style={inputGroup}>
            <label>Last Name *</label>
            <input
              style={inputStyle}
              value={user.lastName || ""}
              onChange={(e) =>
                setUser({ ...user, lastName: e.target.value })
              }
            />
          </div>

          <div style={inputGroup}>
            <label>Email (cannot be changed)</label>
            <input
              style={{
                ...inputStyle,
                background: "#444",
                color: "#aaa",
                cursor: "not-allowed"
              }}
              value={user.email || ""}
              disabled
            />
          </div>

          <div style={inputGroup}>
            <label>Phone Number *</label>
            <input
              style={inputStyle}
              value={user.phoneNumber || ""}
              onChange={(e) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
            />
          </div>

          <h4 style={sectionHeader}>Address</h4>

          <input style={inputStyle} placeholder="Street" value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })} />

          <input style={inputStyle} placeholder="City" value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })} />

          <input style={inputStyle} placeholder="State" value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })} />

          <input style={inputStyle} placeholder="Zip" value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })} />

          <h4 style={sectionHeader}>Payment (up to 3 cards)</h4>

          {cards.map((card, index) => (
            <div key={index}>
              <input style={inputStyle}
                placeholder={`Card ${index + 1} Number`}
                value={card.encryptedCardNumber}
                onChange={(e) => {
                  const updated = [...cards];
                  updated[index].encryptedCardNumber = e.target.value;
                  setCards(updated);
                }}
              />

              <input style={inputStyle}
                placeholder="Expiration Date (YYYY-MM-DD)"
                value={card.expirationDate}
                onChange={(e) => {
                  const updated = [...cards];
                  updated[index].expirationDate = e.target.value;
                  setCards(updated);
                }}
              />

              <input style={inputStyle}
                placeholder="Billing Address"
                value={card.billingAddress}
                onChange={(e) => {
                  const updated = [...cards];
                  updated[index].billingAddress = e.target.value;
                  setCards(updated);
                }}
              />
            </div>
          ))}

          <h4 style={sectionHeader}>Change Password</h4>

          <input type="password" style={inputStyle}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)} />

          <input type="password" style={inputStyle}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} />

          <button style={primaryButton} type="submit">
            Save Changes
          </button>
        </form>

        {message && (
          <p style={{ 
            marginTop: "12px", 
            color: isError ? "#ff4444" : "#00cc66", 
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {message}
          </p>
        )}
      </section>
    </div>
  );
};

export default Profile;

const pageContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "85vh",
  background: "black",
};

const loadingContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "85vh",
  background: "black",
};

const cardStyle: React.CSSProperties = {
  background: "#111",
  padding: "50px",
  borderRadius: "16px",
  width: "500px",
  boxShadow: "0 0 25px rgba(255, 204, 0, 0.15)",
  color: "white",
};

const titleStyle: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "30px",
  fontSize: "28px",
  color: "#FFCC00",
  letterSpacing: "2px",
};

const inputGroup: React.CSSProperties = {
  marginBottom: "18px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "6px",
  border: "1px solid #333",
  background: "#222",
  color: "white",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#FFCC00",
  color: "black",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
};

const favoritesTitle: React.CSSProperties = {
  marginTop: "50px",
  marginBottom: "20px",
  color: "#FFCC00",
};

const favoritesContainer: React.CSSProperties = {
  display: "flex",
  overflowX: "auto",
  gap: "20px",
  paddingBottom: "10px",
};

const favoriteCard: React.CSSProperties = {
  minWidth: "160px",
  textAlign: "center",
  flexShrink: 0,
};

const sectionHeader: React.CSSProperties = {
  marginTop: "20px",
  marginBottom: "10px",
  color: "#FFCC00",
  fontSize: "16px",
  fontWeight: 600,
};