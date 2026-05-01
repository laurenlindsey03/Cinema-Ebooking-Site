package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tickets")
public class Ticket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ticketId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    private String seatNumber;

    private String ticketType;

    private Double price;

    private String status;

    public Ticket() {}

    public Ticket(Booking booking, String seatNumber, String ticketType, Double price, String status) {
        this.booking = booking;
        this.seatNumber = seatNumber;
        this.ticketType = ticketType;
        this.price = price;
        this.status = status;
    }

    public Integer getTicketId() {
        return ticketId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getTicketType() {
        return ticketType;
    }

    public void setTicketType(String ticketType) {
        this.ticketType = ticketType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
