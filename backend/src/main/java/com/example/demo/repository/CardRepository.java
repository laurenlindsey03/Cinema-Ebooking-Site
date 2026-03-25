package com.example.demo.repository;

import com.example.demo.model.Card;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Integer> {
    List<Card> findByUser(User user);
    long countByUser(User user);
}
