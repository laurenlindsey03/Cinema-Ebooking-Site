package com.example.demo.controller;

import com.example.demo.model.Address;
import com.example.demo.model.Card;
import com.example.demo.model.UserPreference;
import com.example.demo.services.ProfileService;
import com.example.demo.model.CardResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {
    
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PutMapping("/address/{userId}")
    public Address saveAddress(@PathVariable("userId") Integer userId, @RequestBody Address address) {
        return profileService.saveOrUpdateAddress(userId, address);
    }

    @GetMapping("/address/{userId}")
    public Address getAddress(@PathVariable("userId") Integer userId) {
        return profileService.getAddress(userId);
    }

    @GetMapping("/cards/{userId}")
    public List<CardResponse> getCards(@PathVariable("userId") Integer userId) {
        return profileService.getCards(userId);
    }

    @PostMapping("/cards/{userId}")
    public Card addCard(@PathVariable("userId") Integer userId, @RequestBody Card card) {
        return profileService.addCard(userId, card);
    }

    @PutMapping("/preferences/{userId}")
    public UserPreference savePreferences(@PathVariable("userId") Integer userId,
                                          @RequestBody UserPreference pref) {
        return profileService.savePreferences(userId, pref);
    }

    @GetMapping("/preferences/{userId}")
    public UserPreference getPreferences(@PathVariable("userId") Integer userId) {
        return profileService.getPreferences(userId);
    }

}
