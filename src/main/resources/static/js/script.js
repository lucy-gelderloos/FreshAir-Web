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
    formInputBounds.value = map.getBounds();
  });

  map.addListener("zoom_changed", () => {
      testBounds.textContent = map.getBounds();
      formInputBounds.value = map.getBounds();
    console.log(map.getBounds());
  })
}

searchForm.addEventListener('submit',(e) => {
    let map = google.maps.Map(document.getElementById("map"));
    let newLat = formInputLat.value;
    let newLon = formInputLon.value;
    let latLng = new google.maps.latLng(newLat,newLon)
    map.center = {lat: newLat, lon: newLon};
    const marker = new google.maps.Marker({
      position: mapCenter,
      map: map,
    });
});

// searchForm.addEventListener('submit',(e) => {
//   e.preventDefault();
//   getNewMap('http://localhost:8080/search',{ "formInputLatValue": formInputLat.value, "formInputLonValue": formInputLon.value, "formInputUserNameValue": formInputUserName.value});
// });

// // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// async function getNewMap(url = '', data = {}) {
//   const response = await fetch(url, {
//     method: 'POST',
//     mode: 'cors', // no-cors, *cors, same-origin
//     credentials: 'include', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//     },
//     body: JSON.stringify(data)
//   });
//   console.log(response);
//   return response.json(); 
// }

window.initMap = initMap;
