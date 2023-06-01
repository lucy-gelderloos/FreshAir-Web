let defaultViewBoxWidth = 25;
let defaultViewBoxHeight = 50;
let defaultStartXCoord = 15;
let defaultStartYCoord = 0;
let defaultBigAntennaHeight = 10;
let defaultBigAntennaBaseWidth = 2.5;
let defaultBigAntennaBaseHeight = 3;
let defaultAntennaSpacing = 7.5;
let defaultSmallAntennaHeight = 7;
let defaultSmallAntennaWidth = 2;
let defaultSmallAntennaToCorner = 3;
let defaultBoxHeight = 37;
let defaultBoxWidth = 25;
let defaultBigAntennaToCorner = 4.5;

let svgPathString = `m ${defaultStartXCoord}, ${defaultStartYCoord}, v ${defaultBigAntennaHeight} h -${defaultBigAntennaBaseWidth} v ${defaultBigAntennaBaseHeight} h -${defaultAntennaSpacing} v -${defaultSmallAntennaHeight} h -${defaultSmallAntennaWidth} v ${defaultSmallAntennaHeight} h -${defaultSmallAntennaToCorner} v ${defaultBoxHeight} h ${defaultBoxWidth} v -${defaultBoxHeight} h -${defaultBigAntennaToCorner} v -${defaultBigAntennaBaseHeight} h -${defaultBigAntennaBaseWidth} v -${defaultBigAntennaHeight} z`

let pinSvgString = "<svg width=\"" + defaultViewBoxWidth + "\" height=\"" + defaultViewBoxWidth + "\" viewBox=\"0 0 " + defaultViewBoxWidth + " " + defaultViewBoxHeight + "\" id=\"svg5\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\"><defs id=\"defs2\"><clipPath id=\"meterIconClipPath\"><path d=\"" + svgPathString + "\" /></clipPath></defs><g id=\"layer1\"><path id=\"path1712\" style=\"fill:#00e400;stroke:#009a00;stroke-width:1.5;stroke-dasharray:none;stroke-opacity:1;paint-order:fill markers stroke\" d=\"" + svgPathString + "\" clip-path=\"url(#meterIconClipPath)\" /></g></svg>";


  const parser = new DOMParser();
  // A marker with a custom inline SVG.
  const pinSvg = parser.parseFromString(
    pinSvgString,
    "image/svg+xml"
  ).documentElement;

  let svgholder = document.createElement("div");
  svgholder.appendChild(pinSvg);
  console.log(pinSvg);

//import {pinSvgString} from "./stations.js";

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

function makeClosestMarker(station, closestMarkerDiv, infoWindow) {
  closestMarkerDiv.classList.add("closest");
  if (closestMarker == null) {
    closestMarker = new google.maps.marker.AdvancedMarkerView({
      position: { lat: Number(station.lat), lng: Number(station.lon) },
      map: map,
      title: station.siteName,
      content: closestMarkerDiv,
    });
  } else {
    closestMarker.position = { lat: Number(station.lat), lng: Number(station.lon) };
    closestMarker.content = closestMarkerDiv;
  }
  infoWindow.content = infoWindow.content + ": the closest station";
  closestMarker.addEventListener("gmp-click", () => {
    infoWindow.open({
      anchor: marker,
      map: map,
    });
  });
  return closestMarker;
}

function makeMarkers(stationsArr, shortestDistance) {
  let closestEls = [];
  closestEls = document.getElementsByClassName("closestInfo");
  if(closestEls.length > 0) {
    for(let i = 0; i < closestEls.length; i++) {
      closestEls[0].remove();
    }
  }
  stationsArr.forEach((s) => {
    let stationInfoString = "AQI: " + s.currentAQI + " (" + s.aqiDesc + ")";
    let iw = new google.maps.InfoWindow({
      content: stationInfoString,
    });
    const stationMarkerDiv = document.createElement("div");
    stationMarkerDiv.classList.add(s.aqiDesc, "stationMarker");
    stationMarkerDiv.textContent = s.currentAQI;

    let marker = new google.maps.marker.AdvancedMarkerView({
      position: { lat: Number(s.lat), lng: Number(s.lon) },
      title: s.siteName,
      map: map,
      content: stationMarkerDiv
    });

    if(shortestDistance == null) {
      shortestDistance = findClosest(stationsArr);
    }

    if (s.distanceFromUser == shortestDistance) {
      let testPara = document.createElement("p");
      testPara.textContent = "test";
      testPara.classList.add("closestInfo");
      stationMarkerDiv.appendChild(testPara);
    }

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
  //https://developers.google.com/maps/documentation/javascript/markers
//  userMarker = new google.maps.Marker({
//    position: userPosition,
//    map: map
//  });

  userMarker = new google.maps.marker.AdvancedMarkerView({
       map: map,
       position: { lat: 37.42475, lng: -122.094 },
       content: svgholder,
       title: "A marker using a custom SVG image.",
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
