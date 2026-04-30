package com.example.demo.facade;

import com.example.demo.model.Booking;
import com.example.demo.model.Movie;
import com.example.demo.model.Showtime;
import com.example.demo.model.Ticket;
import com.example.demo.model.User;
import com.example.demo.model.Seat;

import com.example.demo.services.PricingService;
import com.example.demo.services.SeatService;
import com.example.demo.services.EmailService;

import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.SeatRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class Checkout implements CheckoutFacade {

    private final PricingService pricingService;
    private final SeatService seatService;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;

    public Checkout(PricingService pricingService, SeatService seatService, EmailService emailService,
                    UserRepository userRepository, ShowtimeRepository showtimeRepository, MovieRepository movieRepository, BookingRepository bookingRepository, TicketRepository ticketRepository, SeatRepository seatRepository) {
        this.pricingService = pricingService;
        this.seatService = seatService;
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    public Map<String, Object> processOrder(Map<String, Object> payload) {
        
        int userId = ((Number) payload.getOrDefault("userId", 0)).intValue();
        long showtimeId = ((Number) payload.getOrDefault("showtimeId", 0L)).longValue();
        int adultCount = ((Number) payload.getOrDefault("adultTickets", 0)).intValue();
        int childCount = ((Number) payload.getOrDefault("childTickets", 0)).intValue();
        int seniorCount = ((Number) payload.getOrDefault("seniorTickets", 0)).intValue();

        @SuppressWarnings("unchecked")
        List<Integer> seatIds = (List<Integer>) payload.get("seatIds");

        List<String> seatLabels = new ArrayList<>();

        // Fetch entities
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Showtime showtime = showtimeRepository.findById(showtimeId)
            .orElseThrow(() -> new RuntimeException("Showtime not found"));
        Movie movie = movieRepository.findById(showtime.getMovieId())
            .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Calculate total
        double total = pricingService.calculateTotal(adultCount, childCount, seniorCount);

        // Generate confirmation number
        String confirmationNumber = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // Mark seats as unavailable
        seatService.markSeatsUnavailable(seatIds, showtime);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalPrice(total);
        booking.setStatus("CONFIRMED");
        booking.setConfirmationNumber(confirmationNumber);

        Booking savedBooking = bookingRepository.save(booking);

        for (Integer seatId : seatIds) {
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new RuntimeException("Seat not found"));
            String actualSeatLabel = seat.getSeatNumber();
            seatLabels.add(actualSeatLabel);

            Ticket ticket = new Ticket();
            ticket.setBooking(savedBooking);
            ticket.setSeatNumber(String.valueOf(seatId));
            ticket.setTicketType("STANDARD");
            ticket.setPrice(total / seatIds.size());
            ticket.setStatus("ACTIVE");

            ticketRepository.save(ticket);
        }

        // Send confirmation email
        emailService.sendBookingConfirmation(confirmationNumber, user, movie, showtime, 
            seatLabels, adultCount, childCount, seniorCount, total);

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("bookingId", savedBooking.getBookingId());
        response.put("confirmationNumber", confirmationNumber);
        response.put("total", total);
        response.put("movieTitle", movie.getTitle());
        response.put("showtime", showtime.getStartTime());
        response.put("seats", seatIds);
        response.put("status", "CONFIRMED");

        return response;
    }
}