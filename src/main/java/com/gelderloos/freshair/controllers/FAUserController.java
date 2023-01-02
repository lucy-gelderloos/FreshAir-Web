package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.repositories.FAUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class FAUserController {

    @Autowired
    FAUserRepository faUserRepository;

}
