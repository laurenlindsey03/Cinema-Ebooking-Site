package com.example.demo.adapter;

import java.util.List;

public interface RecommendationTarget {
    List<String> getRecommendations(Integer userId);
}