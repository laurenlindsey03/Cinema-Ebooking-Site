package com.example.demo.controller;

import com.example.demo.adapter.RecommendationTarget;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationTarget recommendationTarget;

    public RecommendationController(RecommendationTarget recommendationTarget) {
        this.recommendationTarget = recommendationTarget;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<String>> getRecommendationsForUser(@PathVariable Integer userId) {
        List<String> movies = recommendationTarget.getRecommendations(userId);
        return ResponseEntity.ok(movies);
    }
}