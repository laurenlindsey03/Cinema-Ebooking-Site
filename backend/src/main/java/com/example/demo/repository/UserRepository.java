package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // if DNE

// PLACEHOLDER
public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findEmail(String email);
    Optional<User> findConfirmationNum(String confirmationNum);
}
