package com.gelderloos.freshair.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.List;

@Entity
public class FreshAirUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Location userLocation;
    private int userAQI;

    protected FreshAirUser() {};

    public FreshAirUser(Location userLocation) {
        this.userLocation = userLocation;
    };

    public Long getId() {
        return id;
    }

    public Location getUserLocation() {
        return userLocation;
    }

    public void setUserLocation(Location userLocation) {
        this.userLocation = userLocation;
    }
}
