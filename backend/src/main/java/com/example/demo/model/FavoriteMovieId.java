package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class FavoriteMovieId implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "movie_id")
    private Long movieId;

    public FavoriteMovieId() {
    }

    public FavoriteMovieId(Integer userId, Long movieId) {
        this.userId = userId;
        this.movieId = movieId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FavoriteMovieId that)) {
            return false;
        }
        return Objects.equals(userId, that.userId) && Objects.equals(movieId, that.movieId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, movieId);
    }

    
}
