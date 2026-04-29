package com.example.demo.controller;

import com.example.demo.facade.CheckoutFacade;
import com.example.demo.model.Booking;
import com.example.demo.model.Showtime;
import com.example.demo.model.User;
import com.example.demo.repository.BookingRepository;
import com.example.demo.services.SeatService;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final CheckoutFacade checkoutFacade;
    private final SeatService seatService;
    private final ShowtimeRepository showtimeRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingController(CheckoutFacade checkoutFacade, SeatService seatService, ShowtimeRepository showtimeRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.checkoutFacade = checkoutFacade;
        this.seatService = seatService;
        this.showtimeRepository = showtimeRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> processCheckout(@RequestBody Map<String, Object> payload) {
        Map<String, Object> result = checkoutFacade.processOrder(payload);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/cancel/{confirmationNumber}")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable String confirmationNumber,
            @RequestBody Map<String, Object> payload) {
        
        long showtimeId = ((Number) payload.get("showtimeId")).longValue();
        @SuppressWarnings("unchecked")
        List<Integer> seatIds = (List<Integer>) payload.get("seatIds");
        
        Showtime showtime = showtimeRepository.findById(showtimeId)
            .orElseThrow(() -> new RuntimeException("Showtime not found"));
        
        // Release the seats
        seatService.releaseSeats(seatIds, showtime);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "CANCELLED");
        response.put("confirmationNumber", confirmationNumber);
        response.put("message", "Booking cancelled successfully");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getOrderHistory(@PathVariable Integer userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User  not found");
        }

        List<Booking> bookings = bookingRepository.findByUserOrderByBookingDateDesc(user);
        return ResponseEntity.ok(bookings);
    }
}