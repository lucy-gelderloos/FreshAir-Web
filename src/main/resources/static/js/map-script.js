let map;
let userName;

let currentCenter;
// let currentCenter = { lat: 47.620, lng: -122.349 };
const formInputCenter = document.getElementById('formInputCenter');
if(!formInputCenter.value) {
  if(!localStorage.getItem('currentCenter')) {
    currentCenter = { lat: 47.620, lng: -122.349 };
    localStorage.setItem('currentCenter',JSON.stringify(currentCenter));
  } else currentCenter = JSON.parse(localStorage.getItem('currentCenter'));
  console.log(currentCenter);
  formInputCenter.value = currentCenter.lat + "," + currentCenter.lng;
  // formInputCenter.value = JSON.stringify(currentCenter);
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
    center: currentCenter
  });

  console.log(JSON.stringify(currentCenter));

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
  });

}

window.initMap = initMap;
