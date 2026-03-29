package com.example.demo.services;

import com.example.demo.model.Address;
import com.example.demo.model.Card;
import com.example.demo.model.User;
import com.example.demo.model.UserPreference;
import com.example.demo.model.CardResponse;
import com.example.demo.repository.AddressRepository;
import com.example.demo.repository.CardRepository;
import com.example.demo.repository.UserPreferenceRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CardRepository cardRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final JavaMailSender mailSender;

    private static final String SECRET = "MySuperSecretKey";

    public ProfileService(UserRepository userRepository, AddressRepository addressRepository, CardRepository cardRepository, UserPreferenceRepository userPreferenceRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.cardRepository = cardRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.mailSender = mailSender;
    }

    public Address saveOrUpdateAddress(Integer userId, Address newAddress) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findByUser(user).orElse(new Address());
        boolean addressChanged =
            !java.util.Objects.equals(address.getStreet(), newAddress.getStreet()) ||
            !java.util.Objects.equals(address.getCity(), newAddress.getCity()) ||
            !java.util.Objects.equals(address.getState(), newAddress.getState()) ||
            !java.util.Objects.equals(address.getZip(), newAddress.getZip());

        address.setUser(user);
        address.setStreet(newAddress.getStreet());
        address.setCity(newAddress.getCity());
        address.setState(newAddress.getState());
        address.setZip(newAddress.getZip());

        Address savedAddress = addressRepository.save(address);
        if (addressChanged) {
            sendProfileUpdateEmail(user, "Cinema E-Booking Address Update", "Your address information has been changed.");
        }

        return savedAddress;
    }

    public List<CardResponse> getCards(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Card> cards = cardRepository.findByUser(user);

        return cards.stream().map(card -> {
            CardResponse response = new CardResponse();
            response.setCardId(card.getCardId());
            response.setCardNumber("**** **** **** " + card.getLast4());
            response.setExpirationDate(card.getExpirationDate());
            response.setBillingAddress(card.getBillingAddress());
            return response;
        }).toList();
}

    public Card addCard(Integer userId, Card card) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        long count = cardRepository.countByUser(user);
        if (count >= 3) {
            throw new RuntimeException("User cannot havee more than 3 payment cards.");
        }

        String cardNumber = card.getEncryptedCardNumber();
        String last4 = cardNumber.substring(cardNumber.length() - 4);
        card.setLast4(last4);
        String encrypted = encryptCardNumber(card.getEncryptedCardNumber());
        card.setEncryptedCardNumber(encrypted);

        card.setUser(user);
        Card savedCard = cardRepository.save(card);
        sendProfileUpdateEmail(user, "Cinema E-Booking Payment Method Update", "Your payment card information has been changed.");

        return savedCard;
    }

    

    public UserPreference savePreferences(Integer userId, UserPreference incoming) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        UserPreference pref = userPreferenceRepository.findById(userId).orElse(new UserPreference());

        pref.setUser(user);
        pref.setFavoriteGenres(incoming.getFavoriteGenres());
        pref.setPrefferedLanguage(incoming.getPrefferedLanguage());

        return userPreferenceRepository.save(pref);
    }

    public UserPreference getPreferences(Integer userId) {
        return userPreferenceRepository.findById(userId).orElse(null);
    }

    public Address getAddress(Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return addressRepository.findByUser(user).orElse(null);
    }

    private String encryptCardNumber(String cardNumber) {
        try {
            SecretKeySpec key = new SecretKeySpec(SECRET.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, key);

            byte[] encrypted = cipher.doFinal(cardNumber.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Card encryption failed");
        }
    }

    private void sendProfileUpdateEmail(User user, String subject, String body) {
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(user.getEmail());
        emailMessage.setSubject(subject);
        emailMessage.setText(body);
        mailSender.send(emailMessage);
    }
}
