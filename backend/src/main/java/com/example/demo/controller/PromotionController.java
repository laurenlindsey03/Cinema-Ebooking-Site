package com.example.demo.controller;

import com.example.demo.model.Promotion;
import com.example.demo.repository.PromotionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;

import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/promotions")
@CrossOrigin(origins = "http://localhost:3000")
public class PromotionController {

    private final PromotionRepository promotionRepository;
    private final UserRepository userRepository; 
    private final JavaMailSender mailSender;  

    public PromotionController(PromotionRepository promotionRepository, UserRepository userRepository, JavaMailSender mailSender) {
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createPromotion(@RequestBody Promotion promotion) {

        if (promotion.getCode() == null || promotion.getCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Must enter a promo code."));
        }
        
        if (promotionRepository.existsByCode(promotion.getCode())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Enter a promo code that is not already in use."));
        }

        if (promotion.getDiscount() == null || promotion.getDiscount() <= 0 || promotion.getDiscount() > 100) {
            return ResponseEntity.badRequest().body(Map.of("message", "Discount must be between 0 and 100%"));
        }

        if (promotion.getStart() == null || promotion.getEnd() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Must enter start and end dates."));
        }
        if (promotion.getEnd().isBefore(promotion.getStart())) {
            return ResponseEntity.badRequest().body(Map.of("message", "End date cannot be before start date."));
        }

        Promotion savedPromo = promotionRepository.save(promotion);

        sendPromoEmailsToSubscribers(savedPromo);

        return ResponseEntity.ok(savedPromo);
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<?> sendPromotionEmail(@PathVariable Integer id) {
        Promotion promo = promotionRepository.findById(id).orElse(null);
        if (promo == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Promotion not found."));
        }

        int sentCount = sendPromoEmailsToSubscribers(promo);
        
        if (sentCount == 0) {
            return ResponseEntity.ok(Map.of("message", "No users are currently subscribed to promotions."));
        }

        return ResponseEntity.ok(Map.of("message", "Emails successfully resent to " + sentCount + " subscribed customers!"));
    }

    private int sendPromoEmailsToSubscribers(Promotion promo) {
        List<User> subscribedUsers = userRepository.findByPromotionsEnabledTrue();
        if (subscribedUsers.isEmpty()) {
            return 0;
        }

        String subject = "Cinema E-Booking Promotion: " + promo.getDiscount() + "% off!";
        String body = "Use promo code " + promo.getCode() + " to get " + 
                      promo.getDiscount() + "% off your next booking.\n" +
                      "This offer is valid from " + promo.getStart() + 
                      " to " + promo.getEnd() + "!\n";

        int sentCount = 0;
        for (User user : subscribedUsers) {
            try {
                SimpleMailMessage emailMessage = new SimpleMailMessage();
                emailMessage.setTo(user.getEmail());
                emailMessage.setSubject(subject);
                emailMessage.setText(body);
                mailSender.send(emailMessage);
                sentCount++;
            } catch (Exception e) {
                System.out.println("Failed to send promo email to " + user.getEmail());
            }
        }
        return sentCount;
    }
}