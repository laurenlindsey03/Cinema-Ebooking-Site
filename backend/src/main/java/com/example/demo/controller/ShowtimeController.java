package com.example.demo.controller;

import com.example.demo.model.Showtime;
import com.example.demo.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "*")
public class ShowtimeController {

    @Autowired
    private ShowtimeRepository repo;

    @GetMapping
    public List<Showtime> getAllShowtimes() {
        return repo.findAll();
    }

    @GetMapping("/movie/{movieId}")
    public List<Showtime> getShowtimesByMovie(@PathVariable Long movieId) {
        return repo.findByMovieId(movieId);
    }
}
