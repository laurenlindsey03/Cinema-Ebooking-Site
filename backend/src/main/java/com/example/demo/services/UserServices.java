package com.example.demo.services;

import com.example.demo.model.Movie;
import com.example.demo.model.Card;
import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class UserServices {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder hashEncoder = new BCryptPasswordEncoder();
    private final JavaMailSender mailSender;

    public UserServices(UserRepository userRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    public User register(User newUser) {

        // check that user does not already exist in DB
        boolean userExists = userRepository.findEmail(newUser.getEmail()).isPresent();
        if (userExists) {
            throw new RuntimeException(); //message needed?
        }

        newUser.setPassword(hashEncoder.encode(newUser.getPassword())); 
        newUser.setUserStatus(UserStatus.INACTIVE);
        newUser.setRole(UserRole.USER);
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

    public User login() {

    }

    public User editProfile() {

    }

    public void changePassword() {

    }

    public User addCard() {

    }

    public User addToFavorites() {

    }

}
