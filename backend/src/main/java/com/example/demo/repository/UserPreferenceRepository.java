package com.example.demo.repository;

import com.example.demo.model.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Integer> {
    
}
