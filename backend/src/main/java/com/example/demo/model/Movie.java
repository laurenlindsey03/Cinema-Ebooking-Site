package com.example.demo.model;

// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.Map;

// @Document(collection = "movies")
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    private String category;

    @ElementCollection
    @CollectionTable(name = "movie_cast", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "actor_name", nullable = false)
    private List<String> cast;

    private String director;
    private String producer;

    @Column(columnDefinition = "TEXT")
    private String synopsis;
    private String mpaaRating;
    private String status;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> trailer;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<Map<String, Object>> reviews;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<Map<String, Object>> showtimes;

    public Movie() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }  

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getCast() { return cast; }
    public void setCast(List<String> cast) { this.cast = cast; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getProducer() { return producer; }
    public void setProducer(String producer) { this.producer = producer; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getMpaaRating() { return mpaaRating; }
    public void setMpaaRating(String mpaaRating) { this.mpaaRating = mpaaRating; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, Object> getTrailer() { return trailer; }
    public void setTrailer(Map<String, Object> trailer) { this.trailer = trailer; }

    public List<Map<String, Object>> getReviews() { return reviews; }
    public void setReviews(List<Map<String, Object>> reviews) { this.reviews = reviews; }

    public List<Map<String, Object>> getShowtimes() { return showtimes; }
    public void setShowtimes(List<Map<String, Object>> showtimes) { this.showtimes = showtimes; }
    
}