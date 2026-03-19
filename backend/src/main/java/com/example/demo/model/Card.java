package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "paymentCards") //PLACEHOLDER

public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardNumber; // only storing hashed cardNumber
    private String expirationDate;
    private String billingAddress;
    private String CVV;

    public Card() {
    }

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getCardNumber() { 
        return cardNumber; 
    }

    public void setCardNumber(String cardNumber) { 
        this.cardNumber = cardNumber; 
    }

    public String getExpirationDate() { 
        return expirationDate; 
    }

    public void setExpirationDate(String expirationDate) { 
        this.expirationDate = expirationDate; 
    }

    public String getBillingAddress() { 
        return billingAddress; 
    }

    public void setBillingAddress(String billingAddress) { 
        this.billingAddress = billingAddress; 
    }

    public String getCVV() {
        return CVV;
    }

    public void setCVV(String cvv) {
        this.CVV = cvv;
    }
    
}
