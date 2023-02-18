let map;
let userName;

let currentCenter;
const formInputCenter = document.getElementById('formInputCenter');
if(!formInputCenter.value) {
  if(!localStorage.getItem('currentCenter')) {
    currentCenter = { lat: 47.620, lng: -122.349 };
    localStorage.setItem('currentCenter',JSON.stringify(currentCenter));
  } else currentCenter = JSON.parse(localStorage.getItem('currentCenter'));
  formInputCenter.value = currentCenter.lat + "," + currentCenter.lng;
}

let currentBounds;
const formInputBounds = document.getElementById('formInputBounds');
if(!formInputBounds.value) {
  if(!localStorage.getItem('currentBounds')) {
    currentBounds = "-134.741578,44.573786,-109.956421,50.498531";
    localStorage.setItem('currentBounds',currentBounds);
  } else currentBounds = localStorage.getItem('currentBounds');
  formInputBounds.value = currentBounds;
}

let currentZoom;
if(!localStorage.getItem('currentZoom')) {
  currentZoom = 6;
  localStorage.setItem('currentZoom',currentZoom)
} else currentZoom = localStorage.getItem('currentZoom');

const formInputUserName = document.getElementById('formInputUserName');

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
    localStorage.setItem('currentCenter',JSON.stringify(currentCenter));
    formInputCenter.value = currentCenter.lat() + "," + currentCenter.lng();
  });

  map.addListener("zoom_changed", () => {
      currentZoom = map.getZoom();
      localStorage.setItem('currentZoom',currentZoom);
  });

  map.addListener("bounds_changed", () => {
    let boundsRaw = map.getBounds().toString();
    const coordRegex = new RegExp("[\(\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)], [\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)\)]");
    currentBounds = boundsRaw.match(coordRegex)[2] + ',' + boundsRaw.match(coordRegex)[1] + ',' + boundsRaw.match(coordRegex)[4] + ',' + boundsRaw.match(coordRegex)[3];
    formInputBounds.value = currentBounds;

    const baseUrl = "http://localhost:8080/visible-stations/";
    const fullUrl = baseUrl + currentBounds;

    console.log(fullUrl);

    fetch(fullUrl)
    .then((response) => response.json())
    .then((data) => {

      data.forEach(d => {
        console.log(d);
        let station = JSON.parse(d);
        let stationInfoString = "AQI: " + station.currentAQI + " (" + station.aqiDesc + ")";
        let iw = new google.maps.InfoWindow({
          content: stationInfoString
        });

        const stationMarker = document.createElement("div");
        stationMarker.classList.add(station.aqiDesc,"stationMarker");
        stationMarker.textContent = station.currentAQI;

        let marker = new google.maps.marker.AdvancedMarkerView({
          position: {lat: Number(station.lat), lng: Number(station.lon)},
          map: map,
          title: station.siteName,
          content: stationMarker,
        });
        marker.addListener("click", () => {
          iw.open({
            anchor: marker,
            map: map,
          });
        });
      });
    });
  });

}

window.initMap = initMap;
