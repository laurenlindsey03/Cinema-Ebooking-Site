package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "favorite_genres")
    private String favoriteGenres;

    @Column(name = "preferred_language")
    private String preferredLanguage;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFavoriteGenres() {
        return favoriteGenres;
    }

    public void setFavoriteGenres(String favoriteGenres) {
        this.favoriteGenres = favoriteGenres;
    }

    public String getPrefferedLanguage() {
        return preferredLanguage;
    }

    public void setPrefferedLanguage(String prefferedLanguage) {
        this.preferredLanguage = prefferedLanguage;
    }
    
}
