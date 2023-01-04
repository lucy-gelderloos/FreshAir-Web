// Page variables
let map;
let currentLat, currentLon, userName;

//const startSearchBtn = document.getElementById('startSearchBtn');
//const testLatDisplay = document.getElementById('testLatDisplay');
//const testLonDisplay = document.getElementById('testLonDisplay');

const formInputLat = document.getElementById('formInputLat');
const formInputLon = document.getElementById('formInputLon');

// Initialize and add the map
function initMap() {
// need a way to pass in the user's default or most recent location, if available, or set default location if not
// tried passing parameters to initMap. Not sure why it didn't work; investigate if other options don't work
    currentLat = 47.620;
    currentLon = -122.349;

    let lat = currentLat;
    let lon = currentLon;

    const mapCenter = { lat: lat, lng: lon }

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
    formInputLat.value = currentLat;
    formInputLon.value = currentLon;

  });
}

window.initMap = initMap;
