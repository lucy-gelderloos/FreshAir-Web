import {makeStationMarker, makeUserMarker} from "./marker-content.js";

let map;
let userName;
//TODO: if returning visitor, this comes from localstorage or auth
let userId = "1";
let markersArr = [];
let userPosition;
let userMarker;
let shortestDistance = null;
let closestMarker = null;
let hiddenMarker = null;

if (!localStorage.getItem('userPosition')) {
  userPosition = { lat: 47.620, lng: -122.349 };
  localStorage.setItem('userPosition', JSON.stringify(userPosition));
} else userPosition = JSON.parse(localStorage.getItem('userPosition'));

let currentBounds;
if (!localStorage.getItem('currentBounds')) {
  currentBounds = "-134.741578,44.573786,-109.956421,50.498531";
  localStorage.setItem('currentBounds', currentBounds);
} else currentBounds = localStorage.getItem('currentBounds');

let currentZoom;
if (!localStorage.getItem('currentZoom')) {
  currentZoom = 6;
  localStorage.setItem('currentZoom', currentZoom)
} else currentZoom = localStorage.getItem('currentZoom');

async function updateBounds(boundsRaw) {
  const coordRegex = new RegExp("[\(\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)], [\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)\)]");
  currentBounds = boundsRaw.match(coordRegex)[2] + ',' + boundsRaw.match(coordRegex)[1] + ',' + boundsRaw.match(coordRegex)[4] + ',' + boundsRaw.match(coordRegex)[3];
  const baseUrl = "http://localhost:8080/visible-stations/";
  let userUrl = "/" + userId;
  const fullUrl = baseUrl + currentBounds + userUrl;
  //TODO: calculating shortestDistance here means that if the user marker is off the map, it will display the closest station *currently visible*
  let stationsArr = await getStations(fullUrl);
  makeMarkers(stationsArr, shortestDistance);
}

async function updatePosition(clickedLat, clickedLon) {
  const baseUrl = "http://localhost:8080/update-distances/";
  const fullUrl = baseUrl + clickedLat + "/" + clickedLon + "/" + userId;
  let stationsArr = await getStations(fullUrl);
  shortestDistance = findClosest(stationsArr);
  makeMarkers(stationsArr, shortestDistance);
}

async function getStations(url) {
  let stationsArr = [];
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach(d => {
        let station = JSON.parse(d);
        stationsArr.push(station);
      });
    });

  return stationsArr;
}

function findClosest(stationsArr) {
  shortestDistance = stationsArr[0].distanceFromUser;
  stationsArr.forEach(s => {
    if (s.distanceFromUser < shortestDistance) {
      shortestDistance = s.distanceFromUser;
    }
  });
  return shortestDistance;
}

function makeMarkers(stationsArr) {

  stationsArr.forEach((s) => {
    let stationInfoString = "AQI: " + s.currentAQI + " (" + s.aqiDesc + ")";
    let iw = new google.maps.InfoWindow({
      content: stationInfoString,
    });

    const stationSvg = makeStationMarker(s.aqiDesc, s.currentAQI);
    stationSvg.id = `${s.intlAqsCode}-svg`;

    let marker = new google.maps.marker.AdvancedMarkerView({
      position: { lat: Number(s.lat), lng: Number(s.lon) },
      title: s.siteName,
      map: map,
      content: stationSvg
    });

    marker.addEventListener("gmp-click", () => {
      iw.open({
        anchor: marker,
        map: map,
      });
    });
    //TODO: what if two stations are equidistant
  });
}

// Initialize and add the map
 function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: Number(currentZoom),
    center: userPosition,
    mapId: '22ae2503f91415f8'
  });

  let userMarkerSvg = makeUserMarker();

  userMarker = new google.maps.marker.AdvancedMarkerView({
       map: map,
       position: { lat: 37.42475, lng: -122.094 },
      //  the svg might need to be wrapped in a div
       content: userMarkerSvg,
       title: "You Are Here",
     });


  map.addListener("idle", () => {
    let boundsRaw = map.getBounds().toString();
    setTimeout(() => updateBounds(boundsRaw), 250);
  });
  //https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
  map.addListener("click", (mapsMouseEvent) => {
    //  On click, move marker to clicked location
    userPosition = mapsMouseEvent.latLng;
//    userMarker.setPosition(userPosition);
    userMarker.position = userPosition;
    localStorage.setItem('userPosition', JSON.stringify(userPosition));
    updatePosition(userPosition.lat(), userPosition.lng());
  });
  map.addListener("zoom_changed", () => {
    currentZoom = map.getZoom();
    localStorage.setItem('currentZoom', currentZoom);
  });

}

window.initMap = initMap;
