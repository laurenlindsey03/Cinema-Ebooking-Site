package com.example.demo.controller;

import com.example.demo.model.AddShowtimeRequest;
import com.example.demo.model.Showtime;
import com.example.demo.services.AdminShowtimeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminShowtimeController {

    private final AdminShowtimeService adminShowtimeService;

    public AdminShowtimeController(AdminShowtimeService adminShowtimeService) {
        this.adminShowtimeService = adminShowtimeService;
    }

    @PostMapping
    public Showtime addShowtime(@RequestBody AddShowtimeRequest request) {
        return adminShowtimeService.addShowtime(request);
    }

    @GetMapping("/movie/{movieId}")
    public List<Showtime> getShowtimesForMovie(@PathVariable("movieId") Long movieId) {
        return adminShowtimeService.getShowtimesForMovie(movieId);
    }
    
}
