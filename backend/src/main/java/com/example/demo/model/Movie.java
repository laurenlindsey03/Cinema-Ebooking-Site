package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    private String mpaaRating;
    private String status;
    private LocalDate releaseDate;
    private String posterUrl;
    private String trailerUrl;

    @ElementCollection
    @CollectionTable(name = "movie_categories", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "category")
    private List<String> categories;

    @ElementCollection
    @CollectionTable(name = "movie_cast", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "actor_name")
    private List<String> cast;

    @ElementCollection
    @CollectionTable(name = "movie_directors", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "director_name")
    private List<String> directors;

    @ElementCollection
    @CollectionTable(name = "movie_producers", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "producer_name")
    private List<String> producers;

    public Movie() {}

    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getTitle() { 
        return title;
    }

    public void setTitle(String title) { 
        this.title = title; 
    }

    public String getSynopsis() { 
        return synopsis; 
    }

    public void setSynopsis(String synopsis) { 
        this.synopsis = synopsis; 
    }

    public String getMpaaRating() { 
        return mpaaRating; 
    }

    public void setMpaaRating(String mpaaRating) { 
        this.mpaaRating = mpaaRating; 
    }

    public String getStatus() { 
        return status; 
    }

    public void setStatus(String status) { 
        this.status = status; 
    }

    public LocalDate getReleaseDate() { 
        return releaseDate; 
    }

    public void setReleaseDate(LocalDate releaseDate) {
         this.releaseDate = releaseDate; 
    }

    public String getPosterUrl() { 
        return posterUrl; 
    }
    
    public void setPosterUrl(String posterUrl) { 
        this.posterUrl = posterUrl; 
    }

    public String getTrailerUrl() { 
        return trailerUrl; 
    }

    public void setTrailerUrl(String trailerUrl) { 
        this.trailerUrl = trailerUrl; 
    }

    public List<String> getCategories() { 
        return categories; 
    }

    public void setCategories(List<String> categories) { 
        this.categories = categories; 
    }

    public List<String> getCast() { 
        return cast; 
    }

    public void setCast(List<String> cast) { 
        this.cast = cast; 
    }

    public List<String> getDirectors() { 
        return directors; 
    }

    public void setDirectors(List<String> directors) { 
        this.directors = directors; 
    }

    public List<String> getProducers() { 
        return producers; 
    }
    
    public void setProducers(List<String> producers) { 
        this.producers = producers; 
    }
}