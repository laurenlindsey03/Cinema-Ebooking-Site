package com.example.demo.services;

import com.example.demo.model.PasswordReset;
import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.PasswordResetRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional; // if DNE
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class UserServices {

    private final UserRepository userRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder hashEncoder = new BCryptPasswordEncoder();

    public UserServices(UserRepository userRepository, PasswordResetRepository passwordResetRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordResetRepository = passwordResetRepository;
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
        if (!Boolean.TRUE.equals(user.getVerified()) || user.getStatus() != UserStatus.ACTIVE) {
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

    public PasswordReset requestPasswordReset(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required.");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("No account found for that email."));

        PasswordReset reset = new PasswordReset();
        reset.setUser(user);
        reset.setToken(UUID.randomUUID().toString());
        reset.setExpiresAt(java.time.LocalDateTime.now().plusMinutes(30));
        reset.setUsed(false);

        PasswordReset savedReset = passwordResetRepository.save(reset);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("CES Password Reset Request");
        message.setText("Use this reset token to update your password: " + savedReset.getToken());
        mailSender.send(message);

        return savedReset;
    } //requestPasswordReset

    public User resetForgottenPassword(String resetToken, String newPassword) {
        if (resetToken == null || resetToken.trim().isEmpty()) {
            throw new RuntimeException("Reset token is required.");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password is required.");
        }

        PasswordReset reset = passwordResetRepository.findByToken(resetToken).orElseThrow(() -> new RuntimeException("Invalid reset token."));

        if (Boolean.TRUE.equals(reset.getUsed())) {
            throw new RuntimeException("Reset token already used.");
        }

        if (reset.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired.");
        }

        User user = reset.getUser();
        user.setPasswordHash(hashEncoder.encode(newPassword));
        userRepository.save(user);

        reset.setUsed(true);
        passwordResetRepository.save(reset);
        return user;
    } //resetForgottenPassword

    public void changePassword(Integer userId, String newPassword, String oldPassword) {

        // find in DB
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (!hashEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        // provide old password before setting new one
        boolean passwordMatches = hashEncoder.matches(oldPassword, user.getPasswordHash());
        if (!passwordMatches) {
            throw new RuntimeException("New password must be different than old password.");
        }

        // update password
        user.setPasswordHash(hashEncoder.encode(newPassword)); 
        userRepository.save(user);

    }

    public User updateProfile(Integer userId, User incomingUser) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(incomingUser.getFirstName());
        user.setLastName(incomingUser.getLastName());
        user.setPhoneNumber(incomingUser.getPhoneNumber());

        User savedUser = userRepository.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(savedUser.getEmail());
        message.setSubject("Profile Updated");
        message.setText("Your profile information was changed.");

        mailSender.send(message);

        return savedUser;
    }
}
