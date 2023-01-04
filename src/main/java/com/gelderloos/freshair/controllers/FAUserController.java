package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.models.FreshAirUser;
import com.gelderloos.freshair.models.Location;
import com.gelderloos.freshair.models.Station;
import com.gelderloos.freshair.repositories.FAUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.hibernate.cfg.Environment;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.servlet.view.RedirectView;

import static java.util.Objects.isNull;


@Controller
public class FAUserController {

    @Autowired
    FAUserRepository faUserRepository;

    @Value("${maps.api.key}")
    private String mapKey;


    @GetMapping("/")
    public String welcome(Model m) {
        FreshAirUser currentUser;
        double currentLat;
        double currentLon;
        Location currentLocation;

        if(!m.containsAttribute("currentUser") || isNull(m.getAttribute("currentUser"))) {
            currentUser = new FreshAirUser("guest");
            m.addAttribute("currentUser",currentUser);
        } else currentUser = (FreshAirUser) m.getAttribute("currentUser");

        if(!m.containsAttribute("currentLat") || isNull(m.getAttribute("currentLat"))) {
            currentLat = 47.620;
            m.addAttribute("currentLat",currentLat);
        } else currentLat = (double) m.getAttribute("currentLat");

        if(!m.containsAttribute("currentLon") || isNull(m.getAttribute("currentLon"))) {
            currentLon = -122.349;
            m.addAttribute("currentLon",currentLon);
        } else currentLon = (double) m.getAttribute("currentLon");

        if(!m.containsAttribute("distanceFromStation") || isNull(m.getAttribute("distanceFromStation"))) {
            m.addAttribute("distanceFromStation",0);
        }

//        this stuff will probably end up moving to the PUT request for the start search button
        currentLocation = new Location(currentLat, currentLon);
        currentLocation.setSavedByUser(currentUser);
        m.addAttribute("currentLocation",currentLocation);

        String mapUrl = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap";
        m.addAttribute("mapUrl",mapUrl);

        return "index";
    }

    @GetMapping("/search")
    public String search(Model m, String formInputLat, String formInputLon){
        m.addAttribute("currentLat",formInputLat);
        m.addAttribute("currentLon",formInputLon);

        Station spaceNeedle = new Station( 47.620, -122.349);

        Location currentLocation = new Location(Double.parseDouble(formInputLat),Double.parseDouble(formInputLon));
//        Location currentLocation = new Location( -47.620, 122.349);

        double distanceFromStation = spaceNeedle.distanceFromUser(currentLocation);
        m.addAttribute("distanceFromStation",distanceFromStation);
        m.addAttribute("distanceFromStation",String.valueOf(distanceFromStation));
//        m.addAttribute("currentLocation",currentLocation);

        return "index";
    }

}
