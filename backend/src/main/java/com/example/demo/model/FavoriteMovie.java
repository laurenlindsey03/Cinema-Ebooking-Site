package com.example.demo.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "favorite_movies")
public class FavoriteMovie {
    
    @EmbeddedId
    private FavoriteMovieId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    public FavoriteMovie() {
    }

    public FavoriteMovie(FavoriteMovieId id, User user) {
        this.id = id;
        this.user = user;
    }

    public FavoriteMovieId getId() {
        return id;
    }

    public void setId(FavoriteMovieId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
