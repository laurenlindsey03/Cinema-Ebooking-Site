package com.example.demo.services;

import com.example.demo.model.PasswordReset;
import com.example.demo.model.User;
import com.example.demo.repository.PasswordResetRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final PasswordResetRepository passwordResetRepository;
    private final UserRepository userRepository;

    public PasswordResetService(PasswordResetRepository passwordResetRepository, UserRepository userRepository) {
        this.passwordResetRepository = passwordResetRepository;
        this.userRepository = userRepository;
    }

    public PasswordReset createResetToken(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        PasswordReset reset = new PasswordReset();
        reset.setUser(user);
        reset.setToken(UUID.randomUUID().toString());
        reset.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        reset.setUsed(false);

        return passwordResetRepository.save(reset);
    }

    public String resetPassword(String token, String newPasswordHash) {
        PasswordReset reset = passwordResetRepository.findByToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));

        if (Boolean.TRUE.equals(reset.getUsed())) {
            throw new RuntimeException("Token already used");
        }

        if (reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = reset.getUser();
        user.setPasswordHash(newPasswordHash);
        userRepository.save(user);

        reset.setUsed(true);
        passwordResetRepository.save(reset);

        return "Password updated successfully";
    }
    
}
