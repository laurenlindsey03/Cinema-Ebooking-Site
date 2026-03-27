package com.example.demo.services;

import com.example.demo.model.PasswordReset;
import com.example.demo.model.User;
import com.example.demo.repository.PasswordResetRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final PasswordResetRepository passwordResetRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public PasswordResetService(PasswordResetRepository passwordResetRepository, UserRepository userRepository, JavaMailSender mailSender) {
        this.passwordResetRepository = passwordResetRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("No account found with that email address"));

        PasswordReset reset = new PasswordReset();
        reset.setUser(user);
        reset.setToken(UUID.randomUUID().toString());
        reset.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        reset.setUsed(false);

        passwordResetRepository.save(reset);

        String resetLink = "http://localhost:3000/resetpassword?token=" + reset.getToken(); 
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Cinema E-Booking: Password Reset");
        message.setText("Follow the link to reset your password: " + resetLink);

        mailSender.send(message);

    }

    /*
    public PasswordReset createResetToken(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        PasswordReset reset = new PasswordReset();
        reset.setUser(user);
        reset.setToken(UUID.randomUUID().toString());
        reset.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        reset.setUsed(false);

        return passwordResetRepository.save(reset);
    } */

    public String resetPassword(String token, String newPasswordHash) {
        PasswordReset reset = passwordResetRepository.findByToken(token).orElseThrow(() -> new RuntimeException("Invalid token"));

        if (Boolean.TRUE.equals(reset.getUsed())) {
            throw new RuntimeException("Token already used");
        }

        if (reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = reset.getUser();
        user.setPasswordHash(encoder.encode(newPasswordHash));
        userRepository.save(user);

        reset.setUsed(true);
        passwordResetRepository.save(reset);

        return "Password updated successfully";
    }
    
}
