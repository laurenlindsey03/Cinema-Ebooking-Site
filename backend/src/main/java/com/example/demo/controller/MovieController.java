package com.example.demo.controller;

import com.example.demo.model.Movie;
import com.example.demo.repository.MovieRepository; 
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieRepository repo;

    public MovieController(MovieRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Movie> all() {
        return repo.findAll();
    }

    @GetMapping("/now")
    public List<Movie> nowShowing() {
        return repo.findByStatus("NOW_SHOWING");
    }

    @GetMapping("/soon")
    public List<Movie> comingSoon() {
        return repo.findByStatus("COMING_SOON");
    }

    @GetMapping("/search")
    public List<Movie> searchMoviesByTitle(@RequestParam String title) {
        return repo.findByTitleContainingIgnoreCase(title);
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return repo.findById(id).orElse(null);
    }

    @GetMapping("/filter")
    public List<Movie> filterByGenre(@RequestParam String genre) {
        return repo.findByCategory(genre);
    }   
}