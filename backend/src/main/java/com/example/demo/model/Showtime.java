package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "showtimes")
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "hall_name", nullable = false)
    private String hallName;
    private LocalDateTime endTime;
    
    @ManyToOne
    @JoinColumn(name = "showroom_id")
    private Showroom showroom;

    public Showtime() {}

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public Long getMovieId() {
         return movieId; 
    }

    public void setMovieId(Long movieId) { 
        this.movieId = movieId; 
    }

    public LocalDateTime getStartTime() { 
        return startTime; 
    }

    public LocalDateTime getEndTime() { 
        return endTime; 
    }
    
    public void setStartTime(LocalDateTime startTime) { 
        this.startTime = startTime; 
    }

    public void setEndTime(LocalDateTime endTime) { 
        this.endTime = endTime; 
    }

    public Showroom getShowroom() { 
        return showroom; 
    }

    public void setShowroom(Showroom showroom) { 
        this.showroom = showroom; 
    }
    
}