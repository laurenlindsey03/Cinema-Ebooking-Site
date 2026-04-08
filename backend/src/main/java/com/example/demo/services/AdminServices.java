package com.example.demo.services;

import com.example.demo.model.Movie;
import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminServices {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public AdminServices(MovieRepository movieRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    public Movie addMovie(Integer adminUserId, Movie movie) {
        validateAdminUser(adminUserId);
        validateMovie(movie);
        
        movie.setTitle(movie.getTitle().trim());
        movie.setSynopsis(movie.getSynopsis().trim());
        movie.setMpaaRating(movie.getMpaaRating().trim());
        movie.setStatus(movie.getStatus().trim());
        movie.setPosterUrl(movie.getPosterUrl().trim());
        movie.setTrailerUrl(movie.getTrailerUrl().trim());

        movie.setCategories(trimList(movie.getCategories()));
        movie.setCast(trimList(movie.getCast()));
        movie.setDirectors(trimList(movie.getDirectors()));
        movie.setProducers(trimList(movie.getProducers()));

        return movieRepository.save(movie);
    }

    private void validateAdminUser(Integer adminUserId) {
        if (adminUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin user id is required.");
        }

        User user = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin user not found."));

        if (user.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin users can perform this action.");
        }
    }

    private void validateMovie(Movie movie) {
        if (movie == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Movie payload is required.");
        }

        requireText(movie.getTitle(), "title");
        requireText(movie.getSynopsis(), "synopsis");
        requireText(movie.getMpaaRating(), "mpaaRating");
        requireText(movie.getStatus(), "status");
        requireText(movie.getPosterUrl(), "posterUrl");
        requireText(movie.getTrailerUrl(), "trailerUrl");

        if (movie.getReleaseDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "releaseDate is required.");
        }

        requireList(movie.getCategories(), "categories");
        requireList(movie.getCast(), "cast");
        requireList(movie.getDirectors(), "directors");
        requireList(movie.getProducers(), "producers");
    }

    private void requireText(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required.");
        }
    }

    private void requireList(List<String> values, String fieldName) {
        if (values == null || values.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required.");
        }

        boolean hasBlankValue = values.stream().anyMatch(value -> value == null || value.trim().isEmpty());
        if (hasBlankValue) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " cannot contain blank values.");
        }
    }

    private List<String> trimList(List<String> values) {
        return values.stream().map(String::trim).toList();
    }
}
