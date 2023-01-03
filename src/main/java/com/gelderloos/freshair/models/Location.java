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

    private Long lat;
    private Long lon;
    private String locationName;
    protected Location() {};

    public Location(Long lat, Long lon) {
        this.lat = lat;
        this.lon = lon;
    }

    public Long getId() {
        return id;
    }

    public Long getLat() {
        return lat;
    }

    public void setLat(Long lat) {
        this.lat = lat;
    }

    public Long getLon() {
        return lon;
    }

    public void setLon(Long lon) {
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
