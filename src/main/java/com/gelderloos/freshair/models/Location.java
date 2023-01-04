package com.gelderloos.freshair.models;

import javax.persistence.*;

@Entity
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "freshAirUser_id")
    FreshAirUser savedByUser;

    @OneToOne(mappedBy = "userLocation")
    private FreshAirUser user;

    private double lat;
    private double lon;
    private String locationName;
    protected Location() {};

    public Location(double lat, double lon) {
        this.lat = lat;
        this.lon = lon;
    }

    public Long getId() {
        return id;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public FreshAirUser getSavedByUser() {
        return savedByUser;
    }

    public void setSavedByUser(FreshAirUser savedByUser) {
        this.savedByUser = savedByUser;
    }
}
