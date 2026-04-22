package com.example.demo.facade;

import com.example.demo.services.PricingService;
import com.example.demo.services.SeatService;
import com.example.demo.services.EmailService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class Checkout implements CheckoutFacade {

    private final PricingService pricingService;
    private final SeatService seatService;
    private final EmailService emailService;

    public Checkout(PricingService pricingService, SeatService seatService, EmailService emailService) {
        this.pricingService = pricingService;
        this.seatService = seatService;
        this.emailService = emailService;
    }

    @Override
    public Map<String, Object> processOrder(Map<String, Object> payload) {
        
        int adultCount = (Integer) payload.getOrDefault("adultTickets", 0);
        int childCount = (Integer) payload.getOrDefault("childTickets", 0);
        int seniorCount = (Integer) payload.getOrDefault("seniorTickets", 0);

        double total = pricingService.calculateTotal(adultCount, childCount, seniorCount);

        Map<String, Object> response = new HashMap<>();
        response.put("total", total);

        return response;
    }
}