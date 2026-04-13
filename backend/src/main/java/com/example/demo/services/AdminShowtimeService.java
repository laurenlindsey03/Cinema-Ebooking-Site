package com.example.demo.services;

import com.example.demo.model.AddShowtimeRequest;
import com.example.demo.model.Movie;
import com.example.demo.model.Showtime;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.ShowtimeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminShowtimeService {
    
    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;

    public AdminShowtimeService(ShowtimeRepository showtimeRepository, MovieRepository movieRepository) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
    }

    public Showtime addShowtime(AddShowtimeRequest request) {
        if (request.getMovieId() == null) {
            throw new RuntimeException("Movie is required.");
        }
        if (request.getDate() == null) {
            throw new RuntimeException("Date is required.");
        }
        if (request.getTime() == null) {
            throw new RuntimeException("Time is required.");
        }
        if(request.getHallName() == null || request.getHallName().trim().isEmpty()) {
            throw new RuntimeException("Showroom is required.");
        }

        Movie movie = movieRepository.findById(request.getMovieId()).orElseThrow(() -> new RuntimeException("Movie not found."));

        LocalDateTime startTime = LocalDateTime.of(request.getDate(), request.getTime());

        boolean conflict = showtimeRepository.existsByHallNameAndStartTime(request.getHallName(), startTime);

        if (conflict) {
            throw new RuntimeException("Scheduling conflict: this showroom already has a movie at that time.");
        }

        Showtime showtime = new Showtime();
        showtime.setMovieId(movie.getId());
        showtime.setStartTime(startTime);
        showtime.setHallName(request.getHallName());

        return showtimeRepository.save(showtime);
    }

    public List<Showtime> getShowtimesForMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }
}
