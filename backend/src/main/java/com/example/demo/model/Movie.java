package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set; 
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "mpaa_rating", nullable = false)
    private String mpaaRating;

    @Column(name = "status")
    private String status;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "trailer_url")
    private String trailerUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_categories", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "category")
    private Set<String> categories;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_cast", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "actor_name")
    private Set<String> cast;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_directors", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "director_name")
    private Set<String> directors;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "movie_producers", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "producer_name")
    private Set<String> producers;

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

    public Set<String> getCategories() { 
        return categories; 
    }

    public void setCategories(Set<String> categories) { 
        this.categories = categories; 
    }

    public Set<String> getCast() { 
        return cast; 
    }

    public void setCast(Set<String> cast) { 
        this.cast = cast; 
    }

    public Set<String> getDirectors() { 
        return directors; 
    }

    public void setDirectors(Set<String> directors) { 
        this.directors = directors; 
    }

    public Set<String> getProducers() { 
        return producers; 
    }
    
    public void setProducers(Set<String> producers) { 
        this.producers = producers; 
    }
}