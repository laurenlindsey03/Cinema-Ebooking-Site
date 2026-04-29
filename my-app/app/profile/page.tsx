'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type CardData = {
  cardId: number | null;
  cardNumber: string;
  expirationDate: string;
  billingAddress: string;
};

const Profile = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
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
    { cardId: null, cardNumber: "", expirationDate: "", billingAddress: "" },
    { cardId: null, cardNumber: "", expirationDate: "", billingAddress: "" },
    { cardId: null, cardNumber: "", expirationDate: "", billingAddress: "" }
  ]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setLoadingRecs(true);

    fetch(`http://localhost:8080/api/recommendations/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setRecommendations(data);
      } else {
        setRecommendations([]);
      }
      setLoadingRecs(false); 
    })
    .catch(() => {
      setRecommendations([]);
      setLoadingRecs(false);
    });

    fetch(`http://localhost:8080/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));

    fetch(`http://localhost:8080/profile/cards/${userId}`)
      .then(res => res.json())
      .then(cardData => {
        const filled = [
          { cardId: null, cardNumber: "", expirationDate: "", billingAddress: "" },
          { cardId: null, cardNumber: "", expirationDate: "", billingAddress: "" },
          { cardId: null, cardNumber: "", expirationDate: "", billingAddress: "" }
        ];

        if (cardData && cardData.length > 0) {
          cardData.slice(0, 3).forEach((c: any, i: number) => {
            filled[i] = {
              cardId: c.cardId,
              cardNumber: c.cardNumber || "",
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
      .then(data => {
        setFavorites(data);

        const favoriteIds = data
          .map((f: any) => f.movie?.id)
          .filter((id: any) => id !== undefined);

        localStorage.setItem("favorites", JSON.stringify(favoriteIds));
          });

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const card of cards) {
      if (card.cardNumber && card.cardNumber.trim() !== "") {

        const cardDigits = card.cardNumber.replace(/\D/g, "");
        
        if (!card.cardNumber.startsWith("****") && cardDigits.length !== 16) {
          setIsError(true);
          setMessage(`A valid card number should be exactly 16 digits.`);
          return; 
        }
        
        const expirationDate = new Date(card.expirationDate + "-01");
        
        if (!isNaN(expirationDate.getTime()) && expirationDate <= today) {
          setIsError(true);
          setMessage('Card expiration date must be in the future.');
          return; 
        }
      }
    }

    for (const card of cards) {
      if (card.cardNumber && card.cardNumber.trim() !== "" && !card.cardNumber.startsWith("****")) {

        const cardDigits = card.cardNumber.replace(/\D/g, "");
        
        if (cardDigits.length !== 16) {
          setIsError(true);
          setMessage("A valid card number should be exactly 16 digits.");
          return; 
        }

        const expirationDate = new Date(card.expirationDate);
        if (isNaN(expirationDate.getTime())) {
          setIsError(true);
          setMessage("Enter a valid expiration date (YYYY-MM-DD).");
          return;
        }

        if (expirationDate <= today) {
          setIsError(true);
          setMessage("Card expiration date must be in the future.");
          return;
        }

        await fetch(`http://localhost:8080/profile/cards/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: card.cardId,
            encryptedCardNumber: card.cardNumber,
            expirationDate: card.expirationDate,
            billingAddress: card.billingAddress
          })
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

  async function removeFavorite(movieId: number) {
    const userId = user.userId;

    await fetch(`http://localhost:8080/favorites/${userId}/${movieId}`, {
      method: "DELETE"
    });

    setFavorites(prev => prev.filter(f => f.movie.id !== movieId));

    const updatedIds = favorites
      .filter(f => f.movie.id !== movieId)
      .map(f => f.movie.id);

    localStorage.setItem("favorites", JSON.stringify(updatedIds));
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
                value={card.cardNumber}
                onChange={(e) => {
                  const updated = [...cards];
                  updated[index].cardNumber = e.target.value;
                  setCards(updated);
                }}
              />

              <input
                type="month"
                style={inputStyle}
                value={card.expirationDate?.slice(0, 7)}
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

        <h3 style={favoritesTitle}>My Favorite Movies</h3>

        {favorites.length === 0 && (
          <p style={{ color: "#aaa" }}>No favorite movies yet.</p>
        )}

        <div style={favoritesContainer}>
          {favorites.map((fav: any) => {
            const movie = fav?.movie;
            if (!movie || !movie.id) return null;

            return (
              <div key={movie.id} style={favoriteCard}>
                <Link href={`/movie/${movie.id}`}>
                  <img
                    src={movie.posterUrl || "/images/default.jpg"}
                    alt={movie.title}
                    style={{
                      width: "160px",
                      height: "240px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      objectFit: "cover"
                    }}
                  />
                </Link>

                <div style={{ marginTop: "8px" }}>
                  {movie.title}
                </div>
                <button
                onClick={() => removeFavorite(movie.id)}
                style={{
                  marginTop: "6px",
                  background: "red",
                  border: "none",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Remove
                </button>
              </div>
            );
          })}
        </div>
          <div style={{ marginTop: 50, padding: "20px", background: "#1a1a1a", borderRadius: "8px", borderLeft: "4px solid #FFCC00" }}>
          
          {loadingRecs && (
            <p style={{ color: "#aaa", fontStyle: "italic", margin: 0 }}>
              Gemini is generating recommendations based on your favorite movies...
            </p>
          )}

          {!loadingRecs && recommendations.length === 0 && (
            <p style={{ color: "#aaa", margin: 0 }}>
              No recommendations available.
            </p>
          )}

          {!loadingRecs && recommendations.length > 0 && (
            <p style={{ color: "white", fontSize: "16px", margin: 0, lineHeight: "1.5" }}>
              <strong style={{ color: "#FFCC00" }}>Gemini recommends:</strong>{" "}
              {recommendations.join(", ")}.
            </p>
          )}
          
        </div>
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