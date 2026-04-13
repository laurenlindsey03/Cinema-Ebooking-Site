package com.example.demo.controller;

import com.example.demo.model.AddMovieRequest;
import com.example.demo.model.Movie;
import com.example.demo.services.AdminMovieService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminMovieController {

    private final AdminMovieService adminMovieService;

    public AdminMovieController(AdminMovieService adminMovieService) {
        this.adminMovieService = adminMovieService;
    }

    @PostMapping
    public Movie addMovie(@RequestBody AddMovieRequest request) {
        return adminMovieService.addMovie(request);
    }
    
}
