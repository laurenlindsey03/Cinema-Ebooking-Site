package com.example.demo.facade;

import com.example.demo.model.Movie;
import com.example.demo.model.Showtime;
import com.example.demo.model.User;
import com.example.demo.services.PricingService;
import com.example.demo.services.SeatService;
import com.example.demo.services.EmailService;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.MovieRepository;
import org.springframework.stereotype.Service;

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

    public Checkout(PricingService pricingService, SeatService seatService, EmailService emailService,
                    UserRepository userRepository, ShowtimeRepository showtimeRepository, MovieRepository movieRepository) {
        this.pricingService = pricingService;
        this.seatService = seatService;
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }

    @Override
    public Map<String, Object> processOrder(Map<String, Object> payload) {
        
        int userId = (Integer) payload.getOrDefault("userId", 0);
        long showtimeId = ((Number) payload.getOrDefault("showtimeId", 0L)).longValue();
        @SuppressWarnings("unchecked")
        List<Integer> seatIds = (List<Integer>) payload.get("seatIds");
        int adultCount = (Integer) payload.getOrDefault("adultTickets", 0);
        int childCount = (Integer) payload.getOrDefault("childTickets", 0);
        int seniorCount = (Integer) payload.getOrDefault("seniorTickets", 0);

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

        // Send confirmation email
        emailService.sendBookingConfirmation(confirmationNumber, user, movie, showtime, 
            seatIds, adultCount, childCount, seniorCount, total);

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("confirmationNumber", confirmationNumber);
        response.put("total", total);
        response.put("movieTitle", movie.getTitle());
        response.put("showtime", showtime.getStartTime());
        response.put("seats", seatIds);
        response.put("status", "CONFIRMED");

        return response;
    }
}