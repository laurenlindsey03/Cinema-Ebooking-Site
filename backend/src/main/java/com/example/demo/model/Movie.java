package com.example.demo.model;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;
import java.util.Map;

@Document(collection = "movies")
public class Movie {

    @Id
    private String id;

    private String title;
    
    private Object category;

    private List<String> cast;

    private Object director;
    private Object producer;

    private String synopsis;
    private String mpaaRating;
    private String status;

    private Map<String, Object> trailer;
    private Map<String, Object> reviews;

    private List<Map<String, Object>> showtimes;

    public Movie() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }  

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Object getCategory() { return category; }
    public void setCategory(Object category) { this.category = category; }

    public List<String> getCast() { return cast; }
    public void setCast(List<String> cast) { this.cast = cast; }

    public Object getDirector() { return director; }
    public void setDirector(Object director) { this.director = director; }

    public Object getProducer() { return producer; }
    public void setProducer(Object producer) { this.producer = producer; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getMpaaRating() { return mpaaRating; }
    public void setMpaaRating(String mpaaRating) { this.mpaaRating = mpaaRating; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, Object> getTrailer() { return trailer; }
    public void setTrailer(Map<String, Object> trailer) { this.trailer = trailer; }

    public Map<String, Object> getReviews() { return reviews; }
    public void setReviews(Map<String, Object> reviews) { this.reviews = reviews; }

    public List<Map<String, Object>> getShowtimes() { return showtimes; }
    public void setShowtimes(List<Map<String, Object>> showtimes) { this.showtimes = showtimes; }
    
}