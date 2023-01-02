package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.repositories.StationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.hibernate.cfg.Environment;


@Controller
public class StationController {

    @Autowired
    StationRepository stationRepository;


}
