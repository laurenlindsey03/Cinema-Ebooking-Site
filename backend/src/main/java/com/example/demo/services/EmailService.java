package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.model.Movie;
import com.example.demo.model.Showtime;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {
    
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookingConfirmation(
            String confirmationNumber,
            User user,
            Movie movie,
            Showtime showtime,
            List<String> seatLabels,
            int adultCount,
            int childCount,
            int seniorCount,
            double subtotal,
            double fee,
            double tax,
            double total) {
        
        double adultTotal = adultCount * 15;
        double childTotal = childCount * 7;
        double seniorTotal = seniorCount * 10;
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' h:mm a");
        String formattedTime = showtime.getStartTime().format(formatter);
        
        String body = "Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
            "Thank you for booking with Cinema E-Booking!\n\n" +
            "Confirmation Number: " + confirmationNumber + "\n\n" +
            "--- BOOKING DETAILS ---\n" +
            "Movie: " + movie.getTitle() + "\n" +
            "Date & Time: " + formattedTime + "\n" +
            "Hall: " + showtime.getHallName() + "\n" +
            "Seats: " + String.join(", ", seatLabels) + "\n\n" +
            "--- PRICING ---\n" +
            "Adult (" + adultCount + ") @ $15 = $" + adultTotal + "\n" +
            "Child (" + childCount + ") @ $7 = $" + childTotal + "\n" +
            "Senior (" + seniorCount + ") @ $10 = $" + seniorTotal + "\n" +
            "Subtotal: $" + String.format("%.2f", subtotal) + "\n" +
            "Online Booking Fee: $" + String.format("%.2f", fee) + "\n" +
            "Tax (7%): $" + String.format("%.2f", tax) + "\n" +
            "TOTAL: $" + String.format("%.2f", total) + "\n\n" +
            "Enjoy your movie!\n\n" +
            "Cinema E-Booking Team";
        
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("Cinema E-Booking Confirmation #" + confirmationNumber);
        emailMessage.setText(body);
        mailSender.send(emailMessage);
    }
}
