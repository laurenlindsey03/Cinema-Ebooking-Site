package com.example.demo.adapter;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.services.AiService;
import org.springframework.stereotype.Component;

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

        String userPreferences = "popular trending movies";

        User user = userRepository.findById(userId).orElse(null);
        
        if (user != null && user.getUserPreference() != null) {
            String savedGenres = user.getUserPreference().getFavoriteGenres();
            if (savedGenres != null && !savedGenres.trim().isEmpty()) {
                userPreferences = savedGenres; 
            }
        }

        String prompt = "Suggest 3 movies for a user who loves " + userPreferences + ".";

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