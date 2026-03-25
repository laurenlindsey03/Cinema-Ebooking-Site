package com.example.demo.repository;

import com.example.demo.model.FavoriteMovie;
import com.example.demo.model.FavoriteMovieId;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteMovieRepository extends JpaRepository<FavoriteMovie, FavoriteMovieId> {
    List<FavoriteMovie> findByUser(User user);   
}
