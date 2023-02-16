package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.SearchLocation;
import com.gelderloos.freshair.models.FreshAirUser;
import com.gelderloos.freshair.models.Location;
import com.gelderloos.freshair.models.Station;
import com.gelderloos.freshair.repositories.FAUserRepository;
import com.gelderloos.freshair.repositories.LocationRepository;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.hibernate.cfg.Environment;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.net.*;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

import static java.util.Objects.isNull;


@Controller
public class FAUserController {

    @Autowired
    FAUserRepository faUserRepository;

    @Autowired
    LocationRepository locationRepository;

    @Value("${maps.api.key}")
    private String mapKey;

    @Value("${airnow.api.key}")
    private String airNowKey;

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

    public class LatLng {
        private double lat;
        private double lng;
        public LatLng() {};
        public double getLat() {
            return lat;
        }
        public void setLat(double lat) {
            this.lat = lat;
        }
        public double getLng() {
            return lng;
        }
        public void setLng(double lng) {
            this.lng = lng;
        }
    }

    @PostMapping("/search")
    public RedirectView search(String formInputBounds, String formInputCenter, String formInputUserName, String formInputUserId) throws URISyntaxException {
        FreshAirUser currentUser = faUserRepository.findByUserName(formInputUserName);

        Location currentLocation = new Location(Double.parseDouble(formInputCenter.substring(0,formInputCenter.indexOf(','))), Double.parseDouble(formInputCenter.substring(formInputCenter.indexOf(',') + 1)));

        currentLocation.setSavedByUser(currentUser);
        locationRepository.save(currentLocation);

        currentUser.setUserLocation(currentLocation);
        faUserRepository.save(currentUser);

        getStations(formInputBounds,airNowKey);



        return new RedirectView("/");
    }

    public static void getStations(String formInputBounds, String airNowKey) {
        String stationsList = null;

        String baseUrl = "https://www.airnowapi.org/aq/data/?";
        String parameters = "&parameters=PM25";
        String bbox = "&BBOX=" + formInputBounds;
        String dataType = "&dataType=A";
        String format = "&format=application/json";
        String verbose = "&verbose=1";
        String rawConcentrations = "&includerawconcentrations=0";
        String apiKey = "&API_KEY=" + airNowKey;

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest stationRequest = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + parameters + bbox + dataType + format + verbose + rawConcentrations + apiKey))
                .GET()
                .build();

        HttpResponse<String> stationResponse = null;

        try {
            stationResponse = client.send(stationRequest, HttpResponse.BodyHandlers.ofString());
            stationsList = stationResponse.body();
        } catch(IOException | InterruptedException e) {
            e.printStackTrace();
//            TODO: better error handling
        }

        System.out.println("stationsList: " + stationsList);

//            client.sendAsync(stationRequest, HttpResponse.BodyHandlers.ofString())
//                .thenApply(response -> { System.out.println(response.statusCode());
//                    System.out.println(response.headers());
//                    return response; } )
//                .thenApply(HttpResponse::body)
//                .thenAccept(System.out::println);


    }
}
