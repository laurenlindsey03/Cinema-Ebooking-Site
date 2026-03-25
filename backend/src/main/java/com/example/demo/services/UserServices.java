package com.example.demo.services;

import com.example.demo.model.Movie;
import com.example.demo.model.Card;
import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional; // if DNE

import java.util.UUID;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class UserServices {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder hashEncoder = new BCryptPasswordEncoder();
    private final JavaMailSender mailSender;
    private final MovieRepository movieRepository;

    public UserServices(UserRepository userRepository, JavaMailSender mailSender, MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.movieRepository = movieRepository;
    }

    public User register(User newUser) {

        // check that user does not already exist in DB
        boolean userExists = userRepository.findEmail(newUser.getEmail()).isPresent();
        if (userExists) {
            throw new RuntimeException("User is already registered, cannot create a new account.");
        }

        newUser.setPassword(hashEncoder.encode(newUser.getPassword())); 
        newUser.setUserStatus(UserStatus.INACTIVE);
        newUser.setRole(UserRole.CUSTOMER);
        newUser.setConfirmationNum(UUID.randomUUID().toString());

        // save to DB
        User registeredUser = userRepository.save(newUser);

        // send confirmation email
        String recipient = registeredUser.getEmail();
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipient);
        email.setSubject("CES New User Registration Confirmation");

        String message = "Your user registration confirmation number is: " + registeredUser.getConfirmationNum();
        email.setText(message);
        
        mailSender.send(email);

        return registeredUser;
    }

    public boolean verifiedAccount(String confirmationNum) {
        Optional<User> newUser = userRepository.findConfirmationNum(confirmationNum);
        
        if (newUser.isPresent()) {
            User user = newUser.get();

            user.setUserStatus(UserStatus.ACTIVE);

            userRepository.save(user);

            return true;
        }

        return false;
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
        Optional<User> userOptional = userRepository.findEmail(email);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("Invalid email.");
        }

        User user = userOptional.get();

        //check if account is active
        if (user.getUserStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Please verify your email and log in again.");
        }

        // Validate password
        boolean passwordMatches = hashEncoder.matches(password, user.getPassword());
        if (!passwordMatches) {
            throw new RuntimeException("Invalid password.");
        }

        // Successful login
        return user;
    } //login

    public void requestPasswordReset(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required.");
        }

        Optional<User> userOptional = userRepository.findEmail(email);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("No account found for that email.");
        }

        User user = userOptional.get();

        // Reuse confirmationNum as a one-time reset token.
        String resetToken = UUID.randomUUID().toString();
        user.setConfirmationNum(resetToken);
        userRepository.save(user);

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("CES Password Reset Link");
        emailMessage.setText("Use this reset token to update your password: " + resetToken);
        mailSender.send(emailMessage);
    } //requestPasswordReset

    public User resetForgottenPassword(String resetToken, String newPassword) {
        if (resetToken == null || resetToken.trim().isEmpty()) {
            throw new RuntimeException("Reset token is required.");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("New password is required.");
        }

        Optional<User> userOptional = userRepository.findConfirmationNum(resetToken);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("Invalid reset token.");
        }

        User user = userOptional.get();
        user.setPassword(hashEncoder.encode(newPassword));

        // Rotate token so the same reset token cannot be reused.
        user.setConfirmationNum(UUID.randomUUID().toString());

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("CES Password Reset");
        emailMessage.setText("Your password has been reset.");
        mailSender.send(emailMessage);

        return userRepository.save(user);
    } //resetForgottenPassword

    //methods to edit profile information:
    public void changePassword(Long id, String newPassword, String oldPassword) {

        // find in DB
        User user = userRepository.findById(id).orElseThrow();

        // provide old password before setting new one
        boolean passwordMatches = hashEncoder.matches(oldPassword, user.getPassword());
        if (!passwordMatches) {
            throw new RuntimeException("New password must be different than old password.");
        }

        // update password
        user.setPassword(hashEncoder.encode(newPassword)); 
        userRepository.save(user);

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("CES Password Change");
        emailMessage.setText("Your password has been changed.");
        mailSender.send(emailMessage);

    }

    public void changePhoneNumber(Long id, String newPhoneNumber) {
        if (newPhoneNumber == null || newPhoneNumber.trim().isEmpty()) {
            throw new RuntimeException("Phone number is required.");
        }

        User user = userRepository.findById(id).orElseThrow(
            () -> new RuntimeException("User not found.")
        );

        user.setPhoneNumber(newPhoneNumber.trim());
        userRepository.save(user);

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("CES Phone Number Change");
        emailMessage.setText("Your phone number has been changed.");
        mailSender.send(emailMessage);
        
    }

    public void addCard(Long userId, Card card) {
        // Get user from database
        User user = userRepository.findById(userId).orElseThrow(
            () -> new RuntimeException("User not found.")
        );

        // Check if user already has 3 cards
        if (user.getCards().size() >= 3) {
            throw new RuntimeException("User can only have a maximum of 3 saved cards.");
        }

        // Add the card to user's cards
        user.getCards().add(card);

        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("CES Payment Method Added");
        emailMessage.setText("A new payment method has been added to your account.");
        mailSender.send(emailMessage);
    }

    public void removeCard(Long userId, Long cardId) {
        // Get user from database
        User user = userRepository.findById(userId).orElseThrow(
            () -> new RuntimeException("User not found.")
        );

        // Find and remove the card
        Card cardToRemove = user.getCards().stream()
            .filter(card -> card.getId().equals(cardId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Card not found in user's cards."));

        user.getCards().remove(cardToRemove);

         SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject("CES Payment Method Removed");
        emailMessage.setText("A payment method has been removed from your account.");
        mailSender.send(emailMessage);
    }

    public void addToFavorites(Long id, Long movieId) {

        User user = userRepository.findById(id).orElseThrow();
        Movie movie = movieRepository.findById(movieId).orElseThrow();
        user.getFavorites().add(movie);
        userRepository.save(user);

    }

    public void removeFromFavorites(Long id, Long movieId) {

        User user = userRepository.findById(id).orElseThrow();
        Movie movie = movieRepository.findById(movieId).orElseThrow();

        if (user.getFavorites().contains(movie)) {
            user.getFavorites().remove(movie);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Movie not found in favorites list.");
        }

    }

    

}
