package com.example.demo.adapter;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.services.AiService;
import org.springframework.stereotype.Component;
import com.example.demo.model.FavoriteMovie;

import java.util.ArrayList;
import java.util.List;

@Component
public class RecommendationAdapter implements RecommendationTarget {

    private final AiService geminiApiService;
    private final UserRepository userRepository;

    public RecommendationAdapter(AiService geminiApiService, UserRepository userRepository) {
        this.geminiApiService = geminiApiService;
        this.userRepository = userRepository;
    }

    @Override
    public List<String> getRecommendations(Integer userId) {

       String prompt = "Suggest 3 popular trending movies. Reply ONLY with a comma-separated list of titles.";

       User user = userRepository.findById(userId).orElse(null);

       if (user != null) {
            if (user.getFavoriteMovies() != null && !user.getFavoriteMovies().isEmpty()) {

                List<String> favoriteMovies = new ArrayList<>();

                for (FavoriteMovie movie : user.getFavoriteMovies()) {
                    if (movie.getMovie() != null && movie.getMovie().getTitle() != null) {
                        favoriteMovies.add(movie.getMovie().getTitle());
                    }
                }

                if (!favoriteMovies.isEmpty()) {
                    String favoritedList = String.join(", ", favoriteMovies);
                    prompt = "Suggest 3 movies similar to these: " + favoritedList + 
                             ". Reply ONLY with a comma-separated list of titles. Do not include the original movies in your response.";
                }
            }
       }

        String aiResponse = geminiApiService.fetchGeminiResponse(prompt);

        List<String> recommendedMovies = new ArrayList<>();
        if (aiResponse != null && !aiResponse.trim().isEmpty()) {
            String[] titles = aiResponse.split(",");
            for (String title : titles) {
                recommendedMovies.add(title.trim());
            }
        }

        return recommendedMovies;

    }
}