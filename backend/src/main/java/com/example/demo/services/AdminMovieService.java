package com.example.demo.services;

import com.example.demo.model.AddMovieRequest;
import com.example.demo.model.Movie;
import com.example.demo.repository.MovieRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminMovieService {
    
    private final MovieRepository movieRepository;

    public AdminMovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie addMovie(AddMovieRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required.");
        }
        if (request.getMpaaRating() == null || request.getMpaaRating().trim().isEmpty()) {
            throw new RuntimeException("MPAA rating is required.");
        }

        Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setSynopsis(request.getSynopsis());
        movie.setMpaaRating(request.getMpaaRating());
        movie.setStatus(request.getStatus() == null || request.getStatus().isBlank() ? "COMING_SOON" : request.getStatus());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());

        return movieRepository.save(movie);
    }
}
