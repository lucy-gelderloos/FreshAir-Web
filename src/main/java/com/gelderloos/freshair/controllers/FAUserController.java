package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.SearchLocation;
import com.gelderloos.freshair.models.FreshAirUser;
import com.gelderloos.freshair.models.Location;
import com.gelderloos.freshair.models.Station;
import com.gelderloos.freshair.repositories.FAUserRepository;
import com.gelderloos.freshair.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.hibernate.cfg.Environment;
import org.springframework.web.servlet.view.RedirectView;

import static java.util.Objects.isNull;


@Controller
public class FAUserController {

    @Autowired
    FAUserRepository faUserRepository;

    @Autowired
    LocationRepository locationRepository;

    @Value("${maps.api.key}")
    private String mapKey;


    @GetMapping("/")
    public String welcome(Model m) {
        FreshAirUser currentUser;
        double currentLat;
        double currentLon;
        Location currentLocation;

        currentUser = faUserRepository.findByUserName("guest");
        m.addAttribute("currentUser",currentUser);

        if(!isNull(currentUser.getUserLocation())) {
            currentLocation = currentUser.getUserLocation();
        } else {
            currentLocation = new Location(47.620,-122.349);
        }
        currentLat = currentLocation.getLat();
        currentLon = currentLocation.getLon();

        m.addAttribute("currentLocation",currentLocation);
        m.addAttribute("currentLat",currentLat);
        m.addAttribute("currentLon",currentLon);

        if(!m.containsAttribute("distanceFromStation") || isNull(m.getAttribute("distanceFromStation"))) {
            m.addAttribute("distanceFromStation",0);
        }

        String mapUrl = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap";
        m.addAttribute("mapUrl",mapUrl);

        return "index";
    }

    @PostMapping("/search")
    public RedirectView search(String formInputLat, String formInputLon, String formInputUserName){
        FreshAirUser currentUser = faUserRepository.findByUserName(formInputUserName);

        Station spaceNeedle = new Station( 47.620, -122.349);

        Location currentLocation = new Location(Double.parseDouble(formInputLat),Double.parseDouble(formInputLon));
        currentLocation.setSavedByUser(currentUser);
        locationRepository.save(currentLocation);

        double distanceFromStation = spaceNeedle.distanceFromUser(currentLocation);

        currentUser.setUserLocation(currentLocation);
        faUserRepository.save(currentUser);

        return new RedirectView("/");
    }

}
