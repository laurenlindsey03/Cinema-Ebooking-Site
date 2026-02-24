package com.example.demo.repository;
import com.example.demo.model.Movie;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByTitleContainingIgnoreCase(String title);
    List<Movie> findByStatus(String status);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.categories c WHERE LOWER(c) = LOWER(:genre)")
    List<Movie> findByCategory(@Param("genre") String genre);
}