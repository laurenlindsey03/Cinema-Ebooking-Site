package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "showtimes")
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    private LocalDateTime startTime;
    private String hallName;

    public Showtime() {}

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public Movie getMovie() {
         return movie; 
    }

    public void setMovie(Movie movie) { 
        this.movie = movie; 
    }

    public LocalDateTime getStartTime() { 
        return startTime; 
    }
    
    public void setStartTime(LocalDateTime startTime) { 
        this.startTime = startTime; 
    }

    public String getHallName() { 
        return hallName; 
    }
    
    public void setHallName(String hallName) { 
        this.hallName = hallName; 
    }
}