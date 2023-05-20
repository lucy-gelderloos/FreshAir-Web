//const clearLocalStorageBtn = document.getElementById('clearLocalStorageBtn');
//clearLocalStorageBtn.addEventListener('click', () => {
//    localStorage.clear();
//});
//
//const resetToDefault = document.getElementById('resetToDefaultBtn');
//resetToDefault.addEventListener('click', () => {
//    localStorage.setItem('currentCenter',JSON.stringify({ lat: 47.620, lng: -122.349 }));
//    localStorage.setItem('currentBounds',"-134.741578,44.573786,-109.956421,50.498531");
//    localStorage.setItem('currentZoom',6);
//    console.log('localStorage',localStorage.getItem('currentZoom'));
//});
//
//
//function getPinCSS(aqi) {
//  let pinColor;
//  if (aqi <= 50) {
//    pinColor = "#00e400";
//  } else if (aqi <= 100) {
//    pinColor = "#ffff00";
//  } else if (aqi <= 150) {
//    pinColor = "#ff7e00";
//  } else if (aqi <= 200) {
//    pinColor = "#ff0000";
//  } else if (aqi <= 300) {
//    pinColor = "#8f3f97";
//  } else if (aqi <= 500) {
//    pinColor = "#7e0023";
//  } else {
//    pinColor = "#888";
//  }
//  return pinColor;
//}
//
//function getAccentCSS(aqi) {
//  let accentColor;
//  if (aqi <= 50) {
//    accentColor = "#009a00";
//  } else if (aqi <= 100) {
//    accentColor = "#b2b200";
//  } else if (aqi <= 150) {
//    accentColor = "#aa5500";
//  } else if (aqi <= 200) {
//    accentColor = "#b70000";
//  } else if (aqi <= 300) {
//    accentColor = "#5b2861";
//  } else if (aqi <= 500) {
//    accentColor = "#4d0016";
//  } else {
//    accentColor = "#222";
//  }
//  return accentColor;
//}

    //        let pinColor = getPinCSS(s.currentAQI);
    //        let accentColor = getAccentCSS(s.currentAQI);
    //        let scale;
    //        if (s.distanceFromUser == shortestDistance) {
    //            scale = 1.5;
    //        } else { scale = 1; }
    //        let stationMarkerPin = new google.maps.marker.PinElement({
    //            background: pinColor,
    //            borderColor: accentColor,
    //            glyphColor: accentColor,
    //            scale: scale
    //        });
