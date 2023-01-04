package com.gelderloos.freshair.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Station extends Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String siteName;
    private int currentAQI;

    protected Station() {};

    public Station(double lat, double lon) {
        super(lat, lon);
    }

    public Station(String siteName, int AQI, double lat, double lon) {
        super(lat, lon);
        this.siteName = siteName;
        this.currentAQI = AQI;
    }

    public double distanceFromUser(Location userLocation) {
        //https://www.geeksforgeeks.org/program-distance-two-points-earth/
        double userLatRadians = Math.toRadians(userLocation.getLat());
        double userLonRadians = Math.toRadians(userLocation.getLon());
        double thisLatRadians = Math.toRadians(this.getLat());
        double thisLonRadians = Math.toRadians(this.getLon());

        double latDistance = thisLatRadians - userLatRadians;
        double lonDistance = thisLonRadians - userLonRadians;

        double a = Math.pow(Math.sin(latDistance / 2), 2)
                + Math.cos(thisLatRadians) * Math.cos(userLatRadians)
                * Math.pow(Math.sin(lonDistance / 2),2);

        double c = 2 * Math.asin(Math.sqrt(a));

//        double r = 6371; // KM
        double r = 3956; // miles

        return(c * r);
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public int getCurrentAQI() {
        return currentAQI;
    }

    public void setCurrentAQI(int currentAQI) {
        this.currentAQI = currentAQI;
    }
}
