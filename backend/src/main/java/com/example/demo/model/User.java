package com.example.demo.model;

import java.util.ArrayList;

import jakarta.persistence.*;

@Entity
@Table(name = "users") //PLACEHOLDER
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    
    private Address homeAddress;

    private String password; 
    
    @Enumerated(EnumType.STRING)
    private UserStatus status;  

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private String confirmationNum;

    private ArrayList<Movie> favorites = new ArrayList<>();
    
    private ArrayList<Card> cards = new ArrayList<>();

    public User() {
    }
    
    public Long getId() { 
        return id; 
    }

    public void setId(Long id) { 
        this.id = id; 
    }

    public String getEmail() { 
        return email; 
    }

    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getFirstName() { 
        return firstName; 
    }

    public void setFirstName(String firstName) { 
        this.firstName = firstName; 
    }

    public String getLastName() { 
        return lastName; 
    }

    public void setLastName(String lastName) { 
        this.lastName = lastName; 
    }

    public String getPhoneNumber() { 
        return phoneNumber; 
    }
    
    public void setPhoneNumber(String phoneNumber) { 
        this.phoneNumber = phoneNumber; 
    }

    public Address getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(Address homeAddress) {
        this.homeAddress = homeAddress;
    }

    public String getPassword() { 
        return password; 
    }
    
    public void setPassword(String password) { 
        this.password = password; 
    }

    public UserStatus getUserStatus() { 
        return status; 
    }

    public void setUserStatus(UserStatus status) { 
        this.status = status; 
    }

    public UserRole getRole() { 
        return role; 
    }

    public void setRole(UserRole role) { 
        this.role = role; 
    }

    public String getConfirmationNum() { 
        return confirmationNum; 
    }

    public void setConfirmationNum(String confirmationNum) { 
        this.confirmationNum = confirmationNum; 
    }

    public ArrayList<Movie> getFavorites() { 
        return favorites; 
    }

    public void setFavorites(ArrayList<Movie> favorites) { 
        this.favorites = favorites; 
    }

    public ArrayList<Card> getCards() { 
        return cards; 
    }

    public void setCards(ArrayList<Card> cards) { 
        this.cards = cards; 
    }

    
}
