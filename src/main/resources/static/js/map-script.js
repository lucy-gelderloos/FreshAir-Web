// Page variables
let map;
let userName;

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
  });

}

window.initMap = initMap;
