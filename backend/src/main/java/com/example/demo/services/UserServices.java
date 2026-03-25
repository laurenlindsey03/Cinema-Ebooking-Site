package com.example.demo.services;

import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional; // if DNE
import java.util.UUID;

@Service
public class UserServices {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder hashEncoder = new BCryptPasswordEncoder();

    public UserServices(UserRepository userRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public User register(User newUser) {

        // check that user does not already exist in DB
        boolean userExists = userRepository.findByEmail(newUser.getEmail()).isPresent();
        if (userExists) {
            throw new RuntimeException("User is already registered, cannot create a new account.");
        }

        newUser.setPasswordHash(hashEncoder.encode(newUser.getPasswordHash())); 
        newUser.setStatus(UserStatus.INACTIVE);
        newUser.setRole(UserRole.CUSTOMER);
        newUser.setVerified(false);
        newUser.setVerificationToken(UUID.randomUUID().toString());
        
        User savedUser = userRepository.save(newUser);
        sendVerificationEmail(savedUser);

        return savedUser;
    }

    public void sendVerificationEmail(User user) {
        String verifyLink = "http://localhost:8080/users/verify?token=" + user.getVerificationToken();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Verify your Cinema E-Booking account");
        message.setText("click this link to verify your account: " + verifyLink);

        mailSender.send(message);
    }

    public String verifyAccount(String token) {
        User user = userRepository.findByVerificationToken(token).orElseThrow(() -> new RuntimeException("Invalid verification token"));

        user.setVerified(true);
        user.setStatus(UserStatus.ACTIVE);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "Account verified successfully";
      
    }

    public User login(String email, String password) {
        //check for email and password inputs
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required.");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password is required.");
        }

        //check if user is in database
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isEmpty()) {
            throw new RuntimeException("Invalid email.");
        }

        User user = userOptional.get();

        //check if account is active
        if (!Boolean.TRUE.equals(user.getVerified()) || user.getUserStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Please verify your email before logging in.");
        }

        // Validate password
        boolean passwordMatches = hashEncoder.matches(password, user.getPasswordHash());
        if (!passwordMatches) {
            throw new RuntimeException("Invalid password.");
        }

        // Successful login
        return user;
    } //login

}
