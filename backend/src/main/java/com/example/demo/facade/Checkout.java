package com.example.demo.facade;

import com.example.demo.services.PricingService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class Checkout implements CheckoutFacade {

    private final PricingService pricingService;

    public Checkout(PricingService pricingService) {
        this.pricingService = pricingService;
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