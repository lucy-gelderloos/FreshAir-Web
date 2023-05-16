package com.gelderloos.freshair.models;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
public class FreshAirUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;
//    private Location userLocation;
    private int userAQI;

    @OneToMany(mappedBy = "savedByUser")
    Set<Location> savedLocations;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id")
    Location userLocation;

    protected FreshAirUser() {};

    public FreshAirUser(String userName) {
        this.userName = userName;
    }

    public FreshAirUser(boolean defaultUser) {
        this.userName = "guest";
        this.userLocation = new Location(47.620,-122.349);
    }

    public Long getId() {
        return id;
    }

    public Location getUserLocation() {
        return userLocation;
    }

    public void setUserLocation(Location userLocation) {
        this.userLocation = userLocation;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
