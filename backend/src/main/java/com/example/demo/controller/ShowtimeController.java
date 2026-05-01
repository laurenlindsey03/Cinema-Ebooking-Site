package com.example.demo.controller;

import com.example.demo.model.Showtime;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.model.SeatStatus;
import com.example.demo.model.Seat;
import com.example.demo.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "*")
public class ShowtimeController {

    @Autowired
    private ShowtimeRepository repo;

    @Autowired
    private SeatRepository seatRepo;

    @GetMapping
    public List<Showtime> getAllShowtimes() {
        return repo.findAll();
    }

    @GetMapping("/movie/{movieId}")
    public List<Showtime> getShowtimesByMovie(@PathVariable Long movieId) {
        return repo.findByMovieId(movieId);
    }

    @GetMapping("/{showtimeId}/seats")
    public List<Seat> getSeatsForShowtime(@PathVariable Long showtimeId) {
        Showtime showtime = repo.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        
        List<Seat> seats = seatRepo.findByShowtime(showtime);

        if (seats.isEmpty()) {
            List<Seat> newlyGeneratedSeats = new ArrayList<>();
            String[] rows = {"A", "B", "C", "D", "E"}; // 5 rows
            
            for (String row : rows) {
                for (int i = 1; i <= 6; i++) { 
                    Seat newSeat = new Seat();
                    newSeat.setShowtime(showtime);
                    newSeat.setSeatNumber(row + i);
                    newSeat.setStatus(SeatStatus.AVAILABLE);
                    newlyGeneratedSeats.add(newSeat);
                }
            }
            seatRepo.saveAll(newlyGeneratedSeats);
            return newlyGeneratedSeats; 
        }

        return seats;
    }
}
