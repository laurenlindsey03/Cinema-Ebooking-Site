package com.example.demo.services;

import com.example.demo.model.Movie;
import com.example.demo.model.Showroom;
import com.example.demo.model.Showtime;
import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.ShowroomRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminServices {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowroomRepository showroomRepository;

    public AdminServices(
            MovieRepository movieRepository,
            UserRepository userRepository,
            ShowtimeRepository showtimeRepository,
            ShowroomRepository showroomRepository
    ) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.showtimeRepository = showtimeRepository;
        this.showroomRepository = showroomRepository;
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

    public List<Showtime> scheduleMovie(Integer adminUserId, Long movieId, Integer showroomId, List<LocalDateTime> startTimes, List<LocalDateTime> endTimes) {
        validateAdminUser(adminUserId);

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found."));

        Showroom showroom = showroomRepository.findById(showroomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Showroom not found."));

        validateShowtimeWindow(startTimes, endTimes);

        List<Showtime> showtimes = new ArrayList<>();
        for (int i = 0; i < startTimes.size(); i++) {
            LocalDateTime startTime = startTimes.get(i);
            LocalDateTime endTime = endTimes.get(i);

            if (!endTime.isAfter(startTime)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endTime must be after startTime.");
            }

            Showtime showtime = new Showtime();
            showtime.setMovieId(movieId);
            showtime.setShowroom(showroom);
            showtime.setStartTime(startTime);
            showtime.setEndTime(endTime);
            showtimes.add(showtime);
        }

        return showtimeRepository.saveAll(showtimes);
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

    private void requireList(List<String> values, String fieldName) { //checks that list is not null
        if (values == null || values.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required.");
        }

        boolean hasBlankValue = values.stream().anyMatch(value -> value == null || value.trim().isEmpty());
        if (hasBlankValue) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " cannot contain blank values.");
        }
    }

    private List<String> trimList(List<String> values) { //trim whitespace from items in list
        return values.stream().map(String::trim).toList();
    }

    private void validateShowtimeWindow(List<LocalDateTime> startTimes, List<LocalDateTime> endTimes) {
        if (startTimes == null || startTimes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one startTime is required.");
        }

        if (endTimes == null || endTimes.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one endTime is required.");
        }

        if (startTimes.size() != endTimes.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startTimes and endTimes must have the same size.");
        }

        boolean hasMissingStart = startTimes.stream().anyMatch(value -> value == null);
        if (hasMissingStart) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "startTimes cannot contain null values.");
        }

        boolean hasMissingEnd = endTimes.stream().anyMatch(value -> value == null);
        if (hasMissingEnd) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endTimes cannot contain null values.");
        }
    }

    
}
