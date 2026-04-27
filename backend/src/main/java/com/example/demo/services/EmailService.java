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
            List<Integer> seatIds,
            int adultCount,
            int childCount,
            int seniorCount,
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
            "Seats: " + String.join(", ", seatIds.stream().map(String::valueOf).toArray(String[]::new)) + "\n\n" +
            "--- PRICING ---\n" +
            "Adult (" + adultCount + ") @ $15 = $" + adultTotal + "\n" +
            "Child (" + childCount + ") @ $7 = $" + childTotal + "\n" +
            "Senior (" + seniorCount + ") @ $10 = $" + seniorTotal + "\n" +
            "TOTAL: $" + total + "\n\n" +
            "Please arrive 15 minutes before your showtime.\n" +
            "For cancellations, use your confirmation number.\n\n" +
            "Enjoy your movie!\n\n" +
            "Cinema E-Booking Team";
        
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("Cinema E-Booking Confirmation #" + confirmationNumber);
        emailMessage.setText(body);
        mailSender.send(emailMessage);
    }
}
