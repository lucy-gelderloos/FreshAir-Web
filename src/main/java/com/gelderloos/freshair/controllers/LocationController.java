package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.repositories.LocationRepository;
import org.hibernate.cfg.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LocationController {

    @Autowired
    LocationRepository locationRepository;

    @Value("${maps.api.key}")
    private String mapKey;


    @GetMapping("/")
    public String welcome(Model m) {
        String mapUrl = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap&v=weekly";
        m.addAttribute("mapUrl",mapUrl);

        return "index";
    }
}
