package com.gelderloos.freshair.controllers;

import com.gelderloos.freshair.repositories.StationRepository;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.hibernate.cfg.Environment;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.ExecutionException;

@Controller
public class StationController {

    @Autowired
    StationRepository stationRepository;

    @Value("${airnow.api.key}")
    private String airnowKey;




    @GetMapping("/allStations")
    // Get request here that itself Gets aqi station data & processes it into a list of Station objects, then passes that to the page
    public String getAllStations(Model m) throws ExecutionException, InterruptedException, IOException {

// query parameters
        String startDate = "2023-01-04T19";
        String endDate = "2023-01-04T20";
        String format = "application/json";

        String maxLat = "45.419415";
        String maxLon = "-75.337882";
        String minLat = "28.716781";
        String minLon = "-124.205070";

        var client = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder(
                        URI.create("https://www.airnowapi.org/aq/data/?startDate=" + startDate + "&endDate=" + endDate + "&parameters=PM25&BBOX=" + minLon + "," + minLat + "," + maxLon + "," + maxLat + "&dataType=A&format=" + format + "&verbose=1&monitorType=0&includerawconcentrations=0&API_KEY=" + airnowKey))
                .header("accept", "application/json")
                .build();
// use the client to send the request
        var responseFuture = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        var response = responseFuture.get();

        JsonObject allStationsJSON = JsonParser.parseString(response.body()).getAsJsonObject();


        // iterate through object & check AQS code to see if is in DB already; if not, create a Station object & add it
        // if the goal is to create a map showing all stations in the search area and their current AQIs, two options: send the JSON as-is over to the maps script, or create a list from the JSON of all AQS codes in response, then pull those from DB. possible pro of second option is having distance from user available, but what if user hasn't selected a location?
        // part of the reason this doesn't make sense is that it doesn't quite need a database; I could probably put most of this in local storage

        m.addAttribute("listOfAllStations",response.body());



        return "index";
    }

    private class AirNowHandler {

    }


}
