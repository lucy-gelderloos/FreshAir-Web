package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.SearchLocation;
import com.gelderloos.freshair.models.FreshAirUser;
import com.gelderloos.freshair.models.Location;
import com.gelderloos.freshair.models.Station;
import com.gelderloos.freshair.repositories.FAUserRepository;
import com.gelderloos.freshair.repositories.LocationRepository;
import com.gelderloos.freshair.repositories.StationRepository;
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
import java.util.ArrayList;
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

    @Autowired
    StationRepository stationRepository;

    @Value("${maps.api.key}")
    private String mapKey;

    @Value("${airnow.api.key}")
    private String airNowKey;

    @GetMapping("/")
    public String welcome(Model m) {
        FreshAirUser currentUser;
        Location currentLocation;

        if(isNull(faUserRepository.findByUserName("guest"))) {
            currentUser = new FreshAirUser("guest");
            faUserRepository.save(currentUser);
        } else currentUser = faUserRepository.findByUserName("guest");
        m.addAttribute("currentUser",currentUser);
        if(!isNull(currentUser.getUserLocation())) {
            currentLocation = currentUser.getUserLocation();
        } else {
            currentLocation = new Location(47.620,-122.349);
        }
        m.addAttribute("currentLocation",currentLocation);
        String mapUrl = "https://maps.googleapis.com/maps/api/js?key=" + mapKey + "&callback=initMap";
        m.addAttribute("mapUrl",mapUrl);

        return "index";
    }

    @GetMapping("/visible-stations")
    public RedirectView getVisibleStations(Model m, String formInputBounds) {
        ArrayList<Station> visibleStations = new ArrayList<>();
        formInputBounds = formInputBounds.replace('%',',');
        System.out.println("formInputBounds: " + formInputBounds);

        RawStations[] rawStations = getStations(formInputBounds,airNowKey);

        for (RawStations rs :
                rawStations) {
            int thisAqi = rs.AQI;
            Station thisStation;
            if (isNull(stationRepository.findByIntlAqsCode(rs.IntlAQSCode))) {
                thisStation = new Station(rs.SiteName,thisAqi,rs.Latitude,rs.Longitude,rs.IntlAQSCode);
            } else {
                thisStation = stationRepository.findByIntlAqsCode(rs.IntlAQSCode);
                thisStation.setCurrentAQI(thisAqi);
            }
            thisStation.updateColor(thisAqi);
            stationRepository.save(thisStation);
            visibleStations.add(thisStation);
        }

        m.addAttribute("visibleStations",visibleStations);

        return new RedirectView("/");
    }

    @PostMapping("/search")
    public RedirectView search(String formInputCenter, String formInputUserName, String formInputUserId) throws URISyntaxException {

        FreshAirUser currentUser = faUserRepository.findByUserName(formInputUserName);

        double newLat = Double.parseDouble(formInputCenter.substring(0,formInputCenter.indexOf(',')));
        double newLon =  Double.parseDouble(formInputCenter.substring(formInputCenter.indexOf(',') + 1));

        Location currentLocation = new Location(newLat, newLon);

        Set<Location> latMatch = locationRepository.findAllByLat(newLat);
        System.out.println(latMatch);

        boolean alreadySaved = false;
        for (Location l :
                latMatch) {
            if(l.getLon() == newLon && l.getSavedByUser() == currentUser) {
                alreadySaved = true;
                currentLocation = l;
            }
        }
        if(!alreadySaved) {
            locationRepository.save(currentLocation);
        }

        currentLocation.setSavedByUser(currentUser);
        locationRepository.save(currentLocation);

        currentUser.setUserLocation(currentLocation);
        faUserRepository.save(currentUser);

        return new RedirectView("/");
    }

    public static RawStations[] getStations(String formInputBounds, String airNowKey) {

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

        HttpResponse<String> stationResponse;
        String stationsList = null;

        try {
            stationResponse = client.send(stationRequest, HttpResponse.BodyHandlers.ofString());
            System.out.println("response code: " + stationResponse.statusCode());
            stationsList = stationResponse.body();
        } catch(IOException | InterruptedException e) {
            e.printStackTrace();
//            TODO: better error handling
        }

        Gson stationsGson = new Gson();
        RawStations[] rawStations = stationsGson.fromJson(stationsList,RawStations[].class);

        return rawStations;
    }

    public static class RawStations {
        private double Latitude;
        private double Longitude;
        private String UTC;
        private String Parameter;
        private String Unit;
        private int AQI;
        private int Category;
        private String SiteName;
        private String AgencyName;
        private String FullAQSCode;
        private String IntlAQSCode;

        public RawStations(double latitude, double longitude, String UTC, String parameter, String unit, int AQI, int category, String siteName, String agencyName, String fullAQSCode, String intlAQSCode) {
            this.Latitude = latitude;
            this.Longitude = longitude;
            this.UTC = UTC;
            this.Parameter = parameter;
            this.Unit = unit;
            this.AQI = AQI;
            this.Category = category;
            this.SiteName = siteName;
            this.AgencyName = agencyName;
            this.FullAQSCode = fullAQSCode;
            this.IntlAQSCode = intlAQSCode;
        }

        public double getLatitude() {
            return Latitude;
        }

        public void setLatitude(double latitude) {
            Latitude = latitude;
        }

        public double getLongitude() {
            return Longitude;
        }

        public void setLongitude(double longitude) {
            Longitude = longitude;
        }

        public String getUTC() {
            return UTC;
        }

        public void setUTC(String UTC) {
            this.UTC = UTC;
        }

        public String getParameter() {
            return Parameter;
        }

        public void setParameter(String parameter) {
            Parameter = parameter;
        }

        public String getUnit() {
            return Unit;
        }

        public void setUnit(String unit) {
            Unit = unit;
        }

        public int getAQI() {
            return AQI;
        }

        public void setAQI(int AQI) {
            this.AQI = AQI;
        }

        public int getCategory() {
            return Category;
        }

        public void setCategory(int category) {
            Category = category;
        }

        public String getSiteName() {
            return SiteName;
        }

        public void setSiteName(String siteName) {
            SiteName = siteName;
        }

        public String getAgencyName() {
            return AgencyName;
        }

        public void setAgencyName(String agencyName) {
            AgencyName = agencyName;
        }

        public String getIntlAQSCode() {
            return IntlAQSCode;
        }

        public void setIntlAQSCode(String intlAQSCode) {
            IntlAQSCode = intlAQSCode;
        }
    }
}
