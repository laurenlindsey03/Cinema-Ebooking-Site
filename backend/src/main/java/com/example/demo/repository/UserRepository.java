package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional; // if DNE

public interface UserRepository extends JpaRepository<User, Integer>{

    Optional<User> findById(Integer userId);
    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);

    boolean existsByEmail(String email);

}
