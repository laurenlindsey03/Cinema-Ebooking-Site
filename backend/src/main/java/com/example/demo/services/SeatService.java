package com.example.demo.services;

import com.example.demo.model.Seat;
import com.example.demo.model.SeatStatus;
import com.example.demo.model.Showtime;
import com.example.demo.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {
    
    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public void markSeatsUnavailable(List<Integer> seatIds, Showtime showtime) {
        for (Integer seatId : seatIds) {
            Seat seat = seatRepository.findByShowtimeAndId(showtime, seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
            
            if (seat.getStatus() == SeatStatus.UNAVAILABLE) {
                throw new RuntimeException("Seat already booked: " + seatId);
            }
            
            seat.setStatus(SeatStatus.UNAVAILABLE);
            seatRepository.save(seat);
        }
    }

    public void releaseSeats(List<Integer> seatIds, Showtime showtime) {
        for (Integer seatId : seatIds) {
            Seat seat = seatRepository.findByShowtimeAndId(showtime, seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found: " + seatId));
            seat.setStatus(SeatStatus.AVAILABLE);
            seatRepository.save(seat);
        }
    }
}
