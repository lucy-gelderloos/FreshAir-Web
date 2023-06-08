package com.gelderloos.freshair.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Station extends Location {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    private String siteName;
    private int currentAQI;
    private String intlAqsCode;

    private String aqiColor;
    private String aqiDesc;
    private double distanceFromUser;

    protected Station() {};

    public Station(double lat, double lon) {
        super(lat, lon);
    }

    public Station(String siteName, double lat, double lon, String intlAqsCode) {
        super(lat, lon);
        this.siteName = siteName;
        this.intlAqsCode = intlAqsCode;
    }
    public Station(String siteName, int aqi, double lat, double lon, String intlAqsCode) {
        super(lat, lon);
        this.siteName = siteName;
        this.currentAQI = aqi;
        this.intlAqsCode = intlAqsCode;
        this.updateColor(aqi);
    }
    public Station(String siteName, int aqi, double lat, double lon, String intlAqsCode, Location userLocation) {
        super(lat, lon);
        this.siteName = siteName;
        this.currentAQI = aqi;
        this.intlAqsCode = intlAqsCode;
        this.updateColor(aqi);
        this.distanceFromUser = findDistanceFromUser(userLocation);
    }

    public double findDistanceFromUser(Location userLocation) {
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

//        TODO: m or km option
//        double r = 6371; // KM
        double r = 3956; // miles

        return(c * r);
    }

    public void updateColor(int aqi) {
        if(aqi < 0) {
//            TODO: if I'm not passing in the color anywhere, get rid of aqiColor property
            this.aqiColor = "gray";
            this.aqiDesc = "error";
        } else if(aqi <= 50) {
            this.aqiColor = "green";
            this.aqiDesc = "good";
        } else if(aqi <= 100) {
            this.aqiColor = "yellow";
            this.aqiDesc = "moderate";
        } else if(aqi <= 150) {
            this.aqiColor = "orange";
            this.aqiDesc = "usg";
        } else if(aqi <= 200) {
            this.aqiColor = "red";
            this.aqiDesc = "unhealthy";
        } else if(aqi <= 300) {
            this.aqiColor = "purple";
            this.aqiDesc = "very-unhealthy";
        } else if(aqi <= 500) {
            this.aqiColor = "maroon";
            this.aqiDesc = "hazardous";
        } else {
            this.aqiColor = null;
            this.aqiDesc = null;
        }
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
        this.updateColor(currentAQI);
    }

    public String getIntlAqsCode() {
        return intlAqsCode;
    }

    public void setIntlAqsCode(String intlAqsCode) {
        this.intlAqsCode = intlAqsCode;
    }

    public String getAqiColor() {
        return aqiColor;
    }

    public void setAqiColor(String aqiColor) {
        this.aqiColor = aqiColor;
    }

    public String getAqiDesc() {
        return aqiDesc;
    }

    public void setAqiDesc(String aqiDesc) {
        this.aqiDesc = aqiDesc;
    }

    public double getDistanceFromUser() {
        return distanceFromUser;
    }

    public void setDistanceFromUser(double distanceFromUser) {
        this.distanceFromUser = distanceFromUser;
    }
}
