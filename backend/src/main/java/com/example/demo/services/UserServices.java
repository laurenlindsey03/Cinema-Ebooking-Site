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
            throw new RuntimeException(); //message needed?
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
        emailMessage.setSubject("CES Password Reset");
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

        return userRepository.save(user);
    } //resetForgottenPassword

    public User editProfile() {

    }

    public void changePassword(Long id, String newPassword, String oldPassword) {

        // find in DB
        User user = userRepository.findById(id).orElseThrow();

        // provide old password before setting new one
        boolean passwordMatches = hashEncoder.matches(oldPassword, user.getPassword());
        if (!passwordMatches) {
            throw new RuntimeException(); // message??
        }

        // update password
        user.setPassword(hashEncoder.encode(newPassword)); 
        userRepository.save(user);

    }

    public User addCard() {

    }

    public void addToFavorites(Long id, Long movieId) {

        User user = userRepository.findById(id).orElseThrow();
        Movie movie = movieRepository.findById(movieId).orElseThrow();
        user.getFavorites().add(movie);
        userRepository.save(user);

    }

}
