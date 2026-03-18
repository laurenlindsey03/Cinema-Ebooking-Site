package com.example.demo.services;

import com.example.demo.model.Movie;

import org.springframework.stereotype.Service;

import com.example.demo.model.Card;
import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.model.UserStatus;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.UserRepository;

@Service
public class UserServices {

    private final UserRepository userRepository;

    public UserServices(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User newUser) {

        // check that user does not already exist in DB??

        newUser.setPassword(newUser.getPassword()); //encrypt?
        newUser.setUserStatus(UserStatus.INACTIVE);
        newUser.setRole(UserRole.USER);
        // send confirmation email

        // save to DB
        User registeredUser = userRepository.save(newUser);
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
