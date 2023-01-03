// Page variables
let map;
let currentLat, currentLon, userName;

//const startSearchBtn = document.getElementById('startSearchBtn');
const testLatDisplay = document.getElementById('testLatDisplay');
const testLonDisplay = document.getElementById('testLonDisplay');

function displayTestValues() {
    testLatDisplay.textContent = currentLat;
    testLonDisplay.textContent = currentLon;
}

// Initialize and add the map
function initMap() {
// need a way to pass in the user's default or most recent location, if available, or set default location if not
// tried passing parameters to initMap. Not sure why it didn't work; investigate if other options don't work
    currentLat = -25.344
    currentLon =  131.031

    let lat = currentLat;
    let lon = currentLon;

    const mapCenter = { lat: lat, lng: lon }

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
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
    console.log("map clicked");
    displayTestValues();
  });
}

window.initMap = initMap;
