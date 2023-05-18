let map;
let userName;
//TODO: if returning visitor, this comes from localstorage or auth
let userId = "1";
let closestMarker = null;
let hiddenStation = null;
let markersMap = new Map();
let markersArr = [];

let currentCenter;
const formInputCenter = document.getElementById('formInputCenter');
if (!formInputCenter.value) {
  if (!localStorage.getItem('currentCenter')) {
    currentCenter = { lat: 47.620, lng: -122.349 };
    localStorage.setItem('currentCenter', JSON.stringify(currentCenter));
  } else currentCenter = JSON.parse(localStorage.getItem('currentCenter'));
  formInputCenter.value = currentCenter.lat + "," + currentCenter.lng;
}

let currentBounds;
const formInputBounds = document.getElementById('formInputBounds');
if (!formInputBounds.value) {
  if (!localStorage.getItem('currentBounds')) {
    currentBounds = "-134.741578,44.573786,-109.956421,50.498531";
    localStorage.setItem('currentBounds', currentBounds);
  } else currentBounds = localStorage.getItem('currentBounds');
  formInputBounds.value = currentBounds;
}

let currentZoom;
if (!localStorage.getItem('currentZoom')) {
  currentZoom = 6;
  localStorage.setItem('currentZoom', currentZoom)
} else currentZoom = localStorage.getItem('currentZoom');

const formInputUserName = document.getElementById('formInputUserName');

async function updateBounds(boundsRaw) {
  const coordRegex = new RegExp("[\(\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)], [\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)\)]");
  currentBounds = boundsRaw.match(coordRegex)[2] + ',' + boundsRaw.match(coordRegex)[1] + ',' + boundsRaw.match(coordRegex)[4] + ',' + boundsRaw.match(coordRegex)[3];
  formInputBounds.value = currentBounds;
  const baseUrl = "http://localhost:8080/visible-stations/";
  let userUrl = "/1";
  const fullUrl = baseUrl + currentBounds + userUrl;
  let stationsArr = await getStations(fullUrl);
  console.log(stationsArr);
//TODO: calculating shortestDistance here means that if the user marker is off the map, it will display the closest station *currently visible*
  let shortestDistance = findClosest(stationsArr);
  makeMarkers(stationsArr,shortestDistance);
}

async function updateCenter(clickedLat,clickedLon) {
  const baseUrl = "http://localhost:8080/update-distances/";
  const fullUrl = baseUrl + clickedLat + "/" + clickedLon + "/" + userId;
  let stationsArr = await getStations(fullUrl);
  let shortestDistance = findClosest(stationsArr);
  makeMarkers(stationsArr,shortestDistance);
}

async function getStations(url) {
  let stationsArr = [];
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach(d => {
//        console.log("d: " + d);
        let station = JSON.parse(d);
//        console.log("station: " + station);
        stationsArr.push(station);
//        console.log("stationsArr: " + stationsArr);
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

function makeClosestMarker(station) {
  let closestMarkerDiv = document.createElement("div");
  closestMarkerDiv.classList.add(station.aqiDesc, "stationMarker", "closest");
  closestMarkerDiv.textContent = station.currentAQI;
  if(closestMarker == null) {
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
  return closestMarker;
}

function getPinCSS(aqi) {
    let pinColor;
    if(aqi <= 50) {
        pinColor = "#00e400";
    } else if(aqi <= 100) {
        pinColor = "#ffff00";
    } else if(aqi <= 150) {
        pinColor = "#ff7e00";
    } else if(aqi <= 200) {
        pinColor = "#ff0000";
    } else if(aqi <= 300) {
        pinColor = "#8f3f97";
    } else if(aqi <= 500) {
        pinColor = "#7e0023";
    } else {
        pinColor = "#888";
    }
    return pinColor;
}

function getAccentCSS(aqi) {
    let accentColor;
    if(aqi <= 50) {
        accentColor = "#009a00";
    } else if(aqi <= 100) {
        accentColor = "#b2b200";
    } else if(aqi <= 150) {
        accentColor = "#aa5500";
    } else if(aqi <= 200) {
        accentColor = "#b70000";
    } else if(aqi <= 300) {
        accentColor = "#5b2861";
    } else if(aqi <= 500) {
        accentColor = "#4d0016";
    } else {
        accentColor = "#222";
    }
    return accentColor;
}

function makeMarkers(stationsArr,shortestDistance) {
    if(markersArr.length > 0) {
        for(let i = 0; i < markersArr.length; i++) {
            markersArr[i].map = null;
            markersArr.splice(i,1);
        }
    }

      let closestStation;
      stationsArr.forEach((s) => {
        let stationInfoString = "AQI: " + s.currentAQI + " (" + s.aqiDesc + ")";
        let iw = new google.maps.InfoWindow({
          content: stationInfoString
        });
//        let pinColor = getPinCSS(s.currentAQI);
//        let accentColor = getAccentCSS(s.currentAQI);
//        let scale;
//        if (s.distanceFromUser == shortestDistance) {
//            scale = 1.5;
//        } else { scale = 1; }
//        let stationMarkerPin = new google.maps.marker.PinElement({
//            background: pinColor,
//            borderColor: accentColor,
//            glyphColor: accentColor,
//            scale: scale
//        });
        const stationMarkerDiv = document.createElement("div");
        stationMarkerDiv.classList.add(s.aqiDesc, "stationMarker");
        stationMarkerDiv.textContent = s.currentAQI;

        let marker;

        if (s.distanceFromUser == shortestDistance) {
            marker = makeClosestMarker(s);
        } else {
            marker = new google.maps.marker.AdvancedMarkerView({
            position: { lat: Number(s.lat), lng: Number(s.lon) },
            map: map,
            title: s.siteName,
            content: stationMarkerDiv
        });
        }

        marker.addEventListener("gmp-click", () => {
          iw.open({
            anchor: marker,
            map: map,
          });
        });

        markersArr.push(marker);


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
    console.log("idle boundsRaw: " + boundsRaw);
    setTimeout(() => updateBounds(boundsRaw),250);
  })

  //https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
  map.addListener("click", (mapsMouseEvent) => {
    //  On click, move marker to clicked location
    currentCenter = mapsMouseEvent.latLng;
    userMarker.setPosition(currentCenter);
    localStorage.setItem('currentCenter', JSON.stringify(currentCenter));
    formInputCenter.value = currentCenter.lat() + "," + currentCenter.lng();
    updateCenter(currentCenter.lat(),currentCenter.lng());
  });

  map.addListener("zoom_changed", () => {
    currentZoom = map.getZoom();
    localStorage.setItem('currentZoom', currentZoom);
    let boundsRaw = map.getBounds().toString();
    console.log("boundsRaw: " + boundsRaw);
    updateBounds(boundsRaw);
  });

  map.addListener("dragend", () => {
    let boundsRaw = map.getBounds().toString();
    updateBounds(boundsRaw);
  });

}

window.initMap = initMap;
