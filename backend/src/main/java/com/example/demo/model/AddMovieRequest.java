package com.example.demo.model;

import java.time.LocalDate;
import java.util.Set;

public class AddMovieRequest {
     
    private String title;
    private String synopsis;
    private String mpaaRating;
    private String status;
    private LocalDate releaseDate;
    private String posterUrl;
    private String trailerUrl;
    private Set<String> categories;
    private Set<String> cast;
    private Set<String> directors;
    private Set<String> producers;

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

    public Set<String> getCategories() { return categories; }
    public void setCategories(Set<String> categories) { this.categories = categories; }
    public Set<String> getCast() { return cast; }
    public void setCast(Set<String> cast) { this.cast = cast; }
    public Set<String> getDirectors() { return directors; }
    public void setDirectors(Set<String> directors) { this.directors = directors; }
    public Set<String> getProducers() { return producers; }
    public void setProducers(Set<String> producers) { this.producers = producers; }

}
