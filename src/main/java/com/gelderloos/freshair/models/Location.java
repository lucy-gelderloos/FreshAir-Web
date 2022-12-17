package com.gelderloos.freshair.models;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Location implements Comparable<Location> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long lat;
    private Long lon;
    private String siteName;
    private int AQI;
//    @OneToMany(mappedBy = "userLocation")
    // make list?
//    Set<Location> savedLocations;

    protected Location() {};

    public Location(Long lat, Long lon) {
        this.lat = lat;
        this.lon = lon;
    }

    public double distanceFromUser(Location userLocation) {
    //https://www.geeksforgeeks.org/program-distance-two-points-earth/
        double userLatRadians = Math.toRadians(userLocation.lat);
        double userLonRadians = Math.toRadians(userLocation.lon);
        double thisLatRadians = Math.toRadians(this.lat);
        double thisLonRadians = Math.toRadians(this.lon);

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

    @Override
    public int compareTo(Location location) {
        Long latCompare = location.lat - this.lat;
        Long lonCompare = location.lon - this.lon;
        // make sure location lat & lon are formatted consistently to prevent bad comparisons

        return (latCompare.intValue() + lonCompare.intValue());
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
}
