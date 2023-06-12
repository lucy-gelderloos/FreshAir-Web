import { makeStationMarker, makeClosestMarker } from "./marker-content.js";

//TODO: if returning visitor, this comes from localstorage or auth
let userId = "1";
let stationsArr = [];

let currentBounds;
if (!localStorage.getItem('currentBounds')) {
  currentBounds = "-134.741578,44.573786,-109.956421,50.498531";
  localStorage.setItem('currentBounds', currentBounds);
} else currentBounds = localStorage.getItem('currentBounds');

async function updateBounds(boundsRaw, map) {
  const coordRegex = new RegExp("[\(\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)], [\(](-?[0-9]{1,3}\.[0-9]{6})[0-9]*, (-?[0-9]{1,3}\.[0-9]{6})[0-9]*[\)\)]");
  currentBounds = boundsRaw.match(coordRegex)[2] + ',' + boundsRaw.match(coordRegex)[1] + ',' + boundsRaw.match(coordRegex)[4] + ',' + boundsRaw.match(coordRegex)[3];
  const baseUrl = "http://localhost:8080/visible-stations/";
  let userUrl = "/" + userId;
  const fullUrl = baseUrl + currentBounds + userUrl;
  let stationsArr = await getStations(fullUrl);
  makeMarkers(stationsArr, map);
}

async function updatePosition(clickedLat, clickedLon, map) {
  const baseUrl = "http://localhost:8080/get-closest/";
  const fullUrl = baseUrl + clickedLat + "/" + clickedLon + "/" + userId;
  let closestStation = null;
  await fetch(fullUrl, { cache: "default" })
    .then((response) => response.json())
    .then((data) => closestStation = data);
  buildClosestMarker(closestStation, map);
}

async function getStations(url) {
  // let stationsArr = [];
  await fetch(url, { cache: "default" })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(d => {
        let station = JSON.parse(d);
        stationsArr.push(station);
      });
    });
  return stationsArr;
}

function makeMarkers(stationsArr, map) {
  stationsArr.forEach((s) => {

    let stationInfoString = "AQI: " + s.currentAQI + " (" + s.aqiDesc + ")";
    let iw = new google.maps.InfoWindow({
      content: stationInfoString,
    });

    const stationSvg = makeStationMarker(s.aqiDesc, s.currentAQI);
    stationSvg.id = `${s.intlAqsCode}-svg`;
    // stationSvg.style.zIndex = 10000 - s.distanceFromUser;

    let marker = new google.maps.marker.AdvancedMarkerView({
      position: { lat: Number(s.lat), lng: Number(s.lon) },
      title: s.siteName,
      map: map,
      content: stationSvg
    });

    marker.zIndex = 10 - s.distanceFromUser;

    marker.addEventListener("gmp-click", () => {
      iw.open({
        anchor: marker,
        map: map,
      });
    });
  });
}

function buildClosestMarker(s,map) {
  if(document.getElementById('closest-svg') != null) {
    document.getElementById('closest-svg').remove();
  }

  let stationInfoString = "AQI: " + s.currentAQI + " (" + s.aqiDesc + ")";
  let iw = new google.maps.InfoWindow({
    content: stationInfoString,
  });

  const stationSvg = makeClosestMarker(s.aqiDesc, s.currentAQI);
  stationSvg.id = `closest-svg`;

  let closestMarker = new google.maps.marker.AdvancedMarkerView({
    position: { lat: Number(s.lat), lng: Number(s.lon) },
    title: s.siteName,
    map: map,
    content: stationSvg,
    zIndex: 99999
  });

  closestMarker.addEventListener("gmp-click", () => {
    iw.open({
      anchor: marker,
      map: map,
    });
  });
}

export { updateBounds, updatePosition }