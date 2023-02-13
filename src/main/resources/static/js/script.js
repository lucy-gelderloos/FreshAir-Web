// Page variables
let map;
let currentLat, currentLon, userName;

const testBounds = document.getElementById('mapBounds');

const formInputLat = document.getElementById('formInputLat');
const formInputLon = document.getElementById('formInputLon');
const formInputBounds = document.getElementById('formInputBounds');
const formInputUserName = document.getElementById('formInputUserName');
const searchForm = document.getElementById('searchForm');

// Initialize and add the map
function initMap() {

  if(!localStorage.getItem('currentLat')) {
    currentLat = "47.620";
  } else currentLat = localStorage.getItem('currentLat');

  if(!localStorage.getItem('currentLon')) {
    currentLon = "-122.349";
  } else currentLon = localStorage.getItem('currentLon');

  let mapCenter = { lat: Number(currentLat), lng: Number(currentLon) }

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: mapCenter,
  });

//https://developers.google.com/maps/documentation/javascript/markers
  const marker = new google.maps.Marker({
    position: mapCenter,
    map: map,
  });

//https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
  map.addListener("click", (mapsMouseEvent) => {
//  On click, move marker to clicked location
    let currentLatLng = mapsMouseEvent.latLng;
    marker.setPosition(currentLatLng);
    currentLat = currentLatLng.lat();
    currentLon = currentLatLng.lng();
    localStorage.setItem('currentLat',currentLat);
    localStorage.setItem('currentLon',currentLon);
    formInputLat.value = currentLat;
    formInputLon.value = currentLon;
    formInputBounds.value = map.getBounds();
  });

  map.addListener("zoom_changed", () => {
      testBounds.textContent = map.getBounds();
      formInputBounds.value = map.getBounds();
  })
}

window.initMap = initMap;
