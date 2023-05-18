let map;
let userName;
//TODO: if returning visitor, this comes from localstorage or auth
let userId = "1";
let markersArr = [];

let currentCenter;
if (!localStorage.getItem('currentCenter')) {
  currentCenter = { lat: 47.620, lng: -122.349 };
  localStorage.setItem('currentCenter', JSON.stringify(currentCenter));
} else currentCenter = JSON.parse(localStorage.getItem('currentCenter'));

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

function updateBounds(boundsRaw) {
  const coordRegex = new RegExp("[\(\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)], [\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)\)]");
  currentBounds = boundsRaw.match(coordRegex)[2] + ',' + boundsRaw.match(coordRegex)[1] + ',' + boundsRaw.match(coordRegex)[4] + ',' + boundsRaw.match(coordRegex)[3];
  formInputBounds.value = currentBounds;
  const baseUrl = "http://localhost:8080/visible-stations/";
  let userUrl = "/" + userId;
  const fullUrl = baseUrl + currentBounds + userUrl;
  //TODO: calculating shortestDistance here means that if the user marker is off the map, it will display the closest station *currently visible*
  updateStations(fullUrl);
}

function updateCenter(clickedLat, clickedLon) {
  const baseUrl = "http://localhost:8080/update-distances/";
  const fullUrl = baseUrl + clickedLat + "/" + clickedLon + "/" + userId;
  updateStations(fullUrl);
}

async function updateStations(url) {
  let stationsArr = await getStations(url);
  let shortestDistance = findClosest(stationsArr);
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
  let shortestDistance = stationsArr[0].distanceFromUser;
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
  iw.content = iw.content + ": the closest station";
  closestMarker.addEventListener("gmp-click", () => {
    iw.open({
      anchor: marker,
      map: map,
    });
  });
  return closestMarker;
}

function makeMarkers(stationsArr, shortestDistance) {
  if (markersArr.length > 0) {
    for (let i = 0; i < markersArr.length; i++) {
      markersArr[i].map = null;
    }
  }
  markersArr = [];
  let closestStation;
  stationsArr.forEach((s) => {
    let stationInfoString = "AQI: " + s.currentAQI + " (" + s.aqiDesc + ")";
    let iw = new google.maps.InfoWindow({
      content: stationInfoString;
    });
    const stationMarkerDiv = document.createElement("div");
    stationMarkerDiv.classList.add(s.aqiDesc, "stationMarker");
    stationMarkerDiv.textContent = s.currentAQI;

    let marker = new google.maps.marker.AdvancedMarkerView({
      position: { lat: Number(s.lat), lng: Number(s.lon) },
      map: map,
      title: s.siteName,
      content: stationMarkerDiv
    });

    if (s.distanceFromUser == shortestDistance) {
      let closestMarkerDiv = stationMarkerDiv;
      makeClosestMarker(s, closestMarkerDiv, iw);
      markersArr.push(marker);
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
    center: currentCenter,
    mapId: '22ae2503f91415f8'
  });
  //https://developers.google.com/maps/documentation/javascript/markers
  const userMarker = new google.maps.Marker({
    position: currentCenter,
    map: map
  });
  map.addListener("idle", () => {
    let boundsRaw = map.getBounds().toString();
    setTimeout(() => updateBounds(boundsRaw), 250);
  })
  //https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
  map.addListener("click", (mapsMouseEvent) => {
    //  On click, move marker to clicked location
    currentCenter = mapsMouseEvent.latLng;
    userMarker.setPosition(currentCenter);
    localStorage.setItem('currentCenter', JSON.stringify(currentCenter));
    updateCenter(currentCenter.lat(), currentCenter.lng());
  });
  map.addListener("zoom_changed", () => {
    currentZoom = map.getZoom();
    localStorage.setItem('currentZoom', currentZoom);
  });
}

window.initMap = initMap;
