package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.cglib.core.Local;

@Entity
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "showtime_id", nullable = false)
    @JsonIgnore
    private Showtime showtime;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Ticket> tickets;

    private LocalDateTime bookingDate;

    private Double totalPrice;

    private String status;
    
    private String confirmationNumber;

    public Booking() {}

    public Booking(User user, Showtime showtime, List<Ticket> tickets, LocalDateTime bookingDate, Double totalPrice, String status) {
        this.user = user;
        this.showtime = showtime;
        this.tickets = tickets;
        this.bookingDate = bookingDate;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Showtime getShowtime() {
        return showtime;
    }

    public void setShowtime(Showtime showtime) {
        this.showtime = showtime;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getConfirmationNumber() {
        return confirmationNumber;
    }

    public void setConfirmationNumber(String confirmationNumber) {
        this.confirmationNumber = confirmationNumber;
    }

}
