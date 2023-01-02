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


@Controller
public class FAUserController {

    @Autowired
    FAUserRepository faUserRepository;

    @Value("${maps.api.key}")
    private String mapKey;


    @GetMapping("/")
    public String welcome(Model m) {
        Location defaultLocation = new Location((long) 47.620, (long) 122.349);
        FreshAirUser defaultUser = new FreshAirUser(defaultLocation);
        String mapUrl = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap&v=weekly";
        m.addAttribute("mapUrl",mapUrl);
        m.addAttribute(defaultLocation);
        m.addAttribute(defaultUser);

        return "index";
    }


}
