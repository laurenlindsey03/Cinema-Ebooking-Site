package com.example.demo.repository;
import com.example.demo.model.Movie;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, String> {
    List<Movie> findByStatus(String status);
    List<Movie> findByTitleContainingIgnoreCase(String title);
    List<Movie> findByCategory(String category);
}