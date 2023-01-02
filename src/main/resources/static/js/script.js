// Initialize and add the map
function initMap() {
  // The location of Uluru
  const mapCenter = { lat: -25.344, lng: 131.031 };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: mapCenter,
  });

  // Add marker positioned at mapCenter
  let marker = new google.maps.Marker({
    position: mapCenter,
    map: map,
  });

// Add info window popup
//  let infoWindow = new google.maps.InfoWindow({
//    content: "Click the map to get Lat/Lng!",
//    position: mapCenter,
//  });
//  infoWindow.open(map);

  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
//  On click, move marker to clicked location
    marker.setPosition(mapsMouseEvent.latLng);

// On click, close existing info window and create a new one with lat/lon
//    infoWindow.close();
//    infoWindow = new google.maps.InfoWindow({
//      position: mapsMouseEvent.latLng,
//    });
//    infoWindow.setContent(
//      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
//    );
//    infoWindow.open(map);
  });
}

window.initMap = initMap;


