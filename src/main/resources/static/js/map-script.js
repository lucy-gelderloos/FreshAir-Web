// Page variables
let map;
let userName;

const testBounds = document.getElementById('mapBounds');

let currentLat;
const formInputLat = document.getElementById('formInputLat');
if(!formInputLat.value) {
  if(!localStorage.getItem('currentLat')) {
    currentLat = "47.620";
    localStorage.setItem('currentLat',currentLat);
  } else currentLat = localStorage.getItem('currentLat');
  formInputLat.value = currentLat;
}

let currentLon;
const formInputLon = document.getElementById('formInputLon');
if(!formInputLon.value) {
  if(!localStorage.getItem('currentLon')) {
    currentLon = "-122.349";
    localStorage.setItem('currentLon',currentLon);
  } else currentLon = localStorage.getItem('currentLon');
  formInputLon.value = currentLon;
}

let currentZoom;
if(!localStorage.getItem('currentZoom')) {
  currentZoom = 6;
  localStorage.setItem('currentZoom',currentZoom)
} else currentZoom = localStorage.getItem('currentZoom');

const formInputBounds = document.getElementById('formInputBounds');
const formInputUserName = document.getElementById('formInputUserName');

// Initialize and add the map
function initMap() {

  let mapCenter = { lat: Number(currentLat), lng: Number(currentLon) }

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: Number(currentZoom),
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
      currentZoom = map.getZoom();
      localStorage.setItem('currentZoom',currentZoom);
  })
}

window.initMap = initMap;
