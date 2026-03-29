package com.example.demo.services;

import com.example.demo.model.FavoriteMovie;
import com.example.demo.model.FavoriteMovieId;
import com.example.demo.model.User;
import com.example.demo.repository.FavoriteMovieRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.demo.model.Movie;
import com.example.demo.repository.MovieRepository;

import java.util.List;

@Service
public class FavoriteMovieService {
    
    private final FavoriteMovieRepository favoriteMovieRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    public FavoriteMovieService(FavoriteMovieRepository favoriteMovieRepository, UserRepository userRepository, MovieRepository movieRepository) {
        this.favoriteMovieRepository = favoriteMovieRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
    }

    public FavoriteMovie addFavorite(Integer userId, Long movieId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("You must be logged in to add to favorites."));

        FavoriteMovieId id = new FavoriteMovieId(userId, movieId);

        if (favoriteMovieRepository.existsById(id)) {
            throw new RuntimeException("Movie already in favorites");
        }

        Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));
            
        FavoriteMovie favoriteMovie = new FavoriteMovie();
        favoriteMovie.setId(id);
        favoriteMovie.setUser(user);
        favoriteMovie.setMovie(movie);

        return favoriteMovieRepository.save(favoriteMovie);
    }

    public void removeFavorite(Integer userId, Long movieId) {
        FavoriteMovieId id = new FavoriteMovieId(userId, movieId);
        favoriteMovieRepository.deleteById(id);
    }

    public List<FavoriteMovie> getFavorites(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteMovieRepository.findByUser(user);
    }

}
