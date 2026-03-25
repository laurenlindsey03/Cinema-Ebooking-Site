package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "payment_cards") 

public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Integer cardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "encrypted_card_number", nullable = false)
    private String encryptedCardNumber; // only storing hashed cardNumber
    
    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "billing_address")
    private String billingAddress;

    public Card() {
    }

    public Integer getCardId() { 
        return cardId; 
    }

    public void setCardId(Integer cardId) { 
        this.cardId = cardId; 
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getEncryptedCardNumber() { 
        return encryptedCardNumber; 
    }

    public void setEncryptedCardNumber(String encryptedCardNumber) { 
        this.encryptedCardNumber = encryptedCardNumber; 
    }

    public LocalDate getExpirationDate() { 
        return expirationDate; 
    }

    public void setExpirationDate(LocalDate expirationDate) { 
        this.expirationDate = expirationDate; 
    }

    public String getBillingAddress() { 
        return billingAddress; 
    }

    public void setBillingAddress(String billingAddress) { 
        this.billingAddress = billingAddress; 
    }

}
