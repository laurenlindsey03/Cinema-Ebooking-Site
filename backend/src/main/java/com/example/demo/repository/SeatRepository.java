package com.example.demo.repository;

import com.example.demo.model.Seat;
import com.example.demo.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByShowtime(Showtime showtime);
    Optional<Seat> findByShowtimeAndId(Showtime showtime, Integer id);
}
