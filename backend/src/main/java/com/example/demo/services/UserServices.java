package com.example.demo.services;

import com.example.demo.model.Movie;

import org.springframework.stereotype.Service;

import com.example.demo.model.Card;
import com.example.demo.model.User;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.UserRepository;

@Service
public class UserServices {

    private final UserRepository userRepository;

    public UserServices(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User newUser) {

        // check that user does not already exist???

        newUser.setPassword(newUser.getPassword());
        newUser.setUserStatus("INACTIVE");
        newUser.setRole("USER");
        // send confirmation email

        
    }
    
}
