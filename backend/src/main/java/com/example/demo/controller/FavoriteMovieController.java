package com.example.demo.controller;

import com.example.demo.model.FavoriteMovie;
import com.example.demo.services.FavoriteMovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteMovieController {

    private final FavoriteMovieService favoriteMovieService;

    public FavoriteMovieController(FavoriteMovieService favoriteMovieService) {
        this.favoriteMovieService = favoriteMovieService;
    }

    @PostMapping("/{userId}/{movieId}")
    public FavoriteMovie addFavorite(@PathVariable Integer userId, @PathVariable Long movieId) {
            return favoriteMovieService.addFavorite(userId, movieId);
    }

    @DeleteMapping("/{userId}/{movieId}")
    public String removeFavorite(@PathVariable Integer userId, @PathVariable Long movieId) {
        favoriteMovieService.removeFavorite((userId), movieId);
        return "Favorite removed";
    }

    @GetMapping("/{userId}")
    public List<FavoriteMovie> getFavorites(@PathVariable Integer userId) {
        return favoriteMovieService.getFavorites(userId);
    }
}
