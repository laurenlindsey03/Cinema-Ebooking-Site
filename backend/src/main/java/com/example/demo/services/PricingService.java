package com.example.demo.services;

import org.springframework.stereotype.Service;

@Service
public class PricingService {

    private static final double ADULT_PRICE = 15.0;
    private static final double CHILD_PRICE = 7.0;
    private static final double SENIOR_PRICE = 10.0;

    public double calculateTotal(int adultCount, int childCount, int seniorCount) {
        double adultTotal = adultCount * ADULT_PRICE;
        double childTotal = childCount * CHILD_PRICE;
        double seniorTotal = seniorCount * SENIOR_PRICE;
        
        return adultTotal + childTotal + seniorTotal;
    }
}