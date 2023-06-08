import { makeUserMarker } from "./marker-content.js";
import { updateBounds,updatePosition } from "./stations.js";

let map;
let userMarker;

let userPosition;
if (!localStorage.getItem('userPosition')) {
  userPosition = { lat: 47.620, lng: -122.349 };
  localStorage.setItem('userPosition', JSON.stringify(userPosition));
} else userPosition = JSON.parse(localStorage.getItem('userPosition'));

let currentZoom;
if (!localStorage.getItem('currentZoom')) {
  currentZoom = 6;
  localStorage.setItem('currentZoom', currentZoom)
} else currentZoom = localStorage.getItem('currentZoom');

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: Number(currentZoom),
    center: userPosition,
    mapId: '22ae2503f91415f8'
  });

  let userMarkerSvg = makeUserMarker();

  userMarker = new google.maps.marker.AdvancedMarkerView({
    map: map,
    position: { lat: 37.42475, lng: -122.094 },
    content: userMarkerSvg,
    title: "You Are Here",
  });

  map.addListener("idle", () => {
    let boundsRaw = map.getBounds().toString();
    setTimeout(() => updateBounds(boundsRaw, map), 250);
  });

  map.addListener("click", (mapsMouseEvent) => {
    userPosition = mapsMouseEvent.latLng;
    userMarker.position = userPosition;
    localStorage.setItem('userPosition', JSON.stringify(userPosition));
    updatePosition(userPosition.lat(), userPosition.lng(), map);
  });

  map.addListener("zoom_changed", () => {
    currentZoom = map.getZoom();
    localStorage.setItem('currentZoom', currentZoom);
  });

}

window.initMap = initMap;
