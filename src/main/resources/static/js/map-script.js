let map;
let userName;

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

function getStationsFromBounds(boundsRaw) {
  const coordRegex = new RegExp("[\(\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)], [\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)\)]");
  currentBounds = boundsRaw.match(coordRegex)[2] + ',' + boundsRaw.match(coordRegex)[1] + ',' + boundsRaw.match(coordRegex)[4] + ',' + boundsRaw.match(coordRegex)[3];
  formInputBounds.value = currentBounds;

  const baseUrl = "http://localhost:8080/visible-stations/";
  const fullUrl = baseUrl + currentBounds;

  console.log(fullUrl);

  fetch(fullUrl)
    .then((response) => response.json())
    .then((data) => {

      let stationsArr = [];
      let shortestDistance = 0;

      //    create array of stations
      data.forEach(d => {
        //        console.log(d);
        let station = JSON.parse(d);
        stationsArr.push(station);
      });

      //    find smallest distance from user
      stationsArr.forEach(s => {
        if (s.distanceFromUser < shortestDistance) {
          shortestDistance = s.distanceFromUser;
        }
      });

      //    create station markers
      stationsArr.forEach(s => {
        let stationInfoString = "AQI: " + s.currentAQI + " (" + s.aqiDesc + ")";
        let iw = new google.maps.InfoWindow({
          content: stationInfoString
        });
        const stationMarker = document.createElement("div");
        stationMarker.classList.add(s.aqiDesc, "stationMarker");
        if (s.distanceFromUser == shortestDistance) { stationMarker.classList.add("closest") };
        stationMarker.textContent = s.currentAQI;

        let marker = new google.maps.marker.AdvancedMarkerView({
          position: { lat: Number(s.lat), lng: Number(s.lon) },
          map: map,
          title: s.siteName,
          content: stationMarker,
        });
        marker.addEventListener("gmp-click", () => {
          iw.open({
            anchor: marker,
            map: map,
          });
        });
      });
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

  //https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
  map.addListener("click", (mapsMouseEvent) => {
    //  On click, move marker to clicked location
    currentCenter = mapsMouseEvent.latLng;
    userMarker.setPosition(currentCenter);
    localStorage.setItem('currentCenter', JSON.stringify(currentCenter));
    formInputCenter.value = currentCenter.lat() + "," + currentCenter.lng();
    let boundsRaw = map.getBounds().toString();
    getStationsFromBounds(boundsRaw);
  });

  map.addListener("zoom_changed", () => {
    currentZoom = map.getZoom();
    localStorage.setItem('currentZoom', currentZoom);
    let boundsRaw = map.getBounds().toString();
    getStationsFromBounds(boundsRaw);
  });

  map.addListener("dragend", () => {
    let boundsRaw = map.getBounds().toString();
    currentBounds = boundsRaw.match(coordRegex)[2] + ',' + boundsRaw.match(coordRegex)[1] + ',' + boundsRaw.match(coordRegex)[4] + ',' + boundsRaw.match(coordRegex)[3];
    getStationsFromBounds(boundsRaw);
  });
}

window.initMap = initMap;
