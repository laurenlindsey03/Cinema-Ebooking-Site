package com.example.demo.repository;

import com.example.demo.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieId(Long movieId);
}