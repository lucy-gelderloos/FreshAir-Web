package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.models.FreshAirUser;
import com.gelderloos.freshair.models.Location;
import com.gelderloos.freshair.repositories.FAUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.hibernate.cfg.Environment;

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
        long currentLat;
        long currentLon;
        Location currentLocation;

        if(!m.containsAttribute("currentUser") || isNull(m.getAttribute("currentUser"))) {
            currentUser = new FreshAirUser("guest");
            m.addAttribute("currentUser",currentUser);
        } else currentUser = (FreshAirUser) m.getAttribute("currentUser");

        if(!m.containsAttribute("currentLat") || isNull(m.getAttribute("currentLat"))) {
            currentLat = (long) 47.620;
            m.addAttribute("currentLat",currentLat);
        } else currentLat = (long) m.getAttribute("currentLat");

        if(!m.containsAttribute("currentLon") || isNull(m.getAttribute("currentLon"))) {
            currentLon = (long) -122.349;
            m.addAttribute("currentLon",currentLon);
        } else currentLon = (long) m.getAttribute("currentLon");

        currentLocation = new Location(currentLat, currentLon);
        currentLocation.setSavedByUser(currentUser);
        m.addAttribute("currentLocation",currentLocation);

        String mapUrl = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap&v=weekly";
        m.addAttribute("mapUrl",mapUrl);

        return "index";
    }


}
