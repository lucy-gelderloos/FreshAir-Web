package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.repositories.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class LocationController {

    @Autowired
    LocationRepository locationRepository;


}
