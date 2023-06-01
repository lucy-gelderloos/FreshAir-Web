let defaultViewBoxWidth = 25;
let defaultViewBoxHeight = 50;
let defaultStartXCoord = 15;
let defaultStartYCoord = 0;
let defaultBigAntennaHeight = 10;
let defaultBigAntennaBaseWidth = 2.5;
let defaultBigAntennaBaseHeight = 3;
let defaultAntennaSpacing = 7.5;
let defaultSmallAntennaHeight = 7;
let defaultSmallAntennaWidth = 2;
let defaultSmallAntennaToCorner = 3;
let defaultBoxHeight = 37;
let defaultBoxWidth = 25;
let defaultBigAntennaToCorner = 4.5;

let svgPathString = `m ${defaultStartXCoord}, ${defaultStartYCoord}, v ${defaultBigAntennaHeight} h -${defaultBigAntennaBaseWidth} v ${defaultBigAntennaBaseHeight} h -${defaultAntennaSpacing} v -${defaultSmallAntennaHeight} h -${defaultSmallAntennaWidth} v ${defaultSmallAntennaHeight} h -${defaultSmallAntennaToCorner} v ${defaultBoxHeight} h ${defaultBoxWidth} v -${defaultBoxHeight} h -${defaultBigAntennaToCorner} v -${defaultBigAntennaBaseHeight} h -${defaultBigAntennaBaseWidth} v -${defaultBigAntennaHeight} z`

const parser = new DOMParser();
// A marker with a custom inline SVG.
const pinSvgString = "<svg width=\"" + defaultViewBoxWidth + "\" height=\"" + defaultViewBoxWidth + "\" viewBox=\"0 0 " + defaultViewBoxWidth + " " + defaultViewBoxHeight + "\" id=\"svg5\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\"><defs id=\"defs2\"><clipPath id=\"meterIconClipPath\"><path d=\"" + svgPathString + "\" /></clipPath></defs><g id=\"layer1\"><path id=\"path1712\" style=\"fill:#00e400;stroke:#009a00;stroke-width:1.5;stroke-dasharray:none;stroke-opacity:1;paint-order:fill markers stroke\" d=\"" + svgPathString + "\" clip-path=\"url(#meterIconClipPath)\" /></g></svg>";

const pinSvg = parser.parseFromString(
  pinSvgString,
  "image/svg+xml"
).documentElement;

document.getElementById("svgTest").appendChild(pinSvg);

//const pinSvgMarkerView = new AdvancedMarkerElement({
//  map,
//  position: { lat: 37.42475, lng: -122.094 },
//  content: pinSvg,
//  title: "A marker using a custom SVG image.",
//});

//const urlGetButton = document.getElementById('urlGetButton');
//const formInputBounds = document.getElementById('formInputBounds');
//
//urlGetButton.addEventListener('click', (e) => {
//    e.preventDefault();
//    const baseUrl = "http://localhost:8080/visible-stations/"
//
//    let bbox = formInputBounds.value;
//
//    const fullUrl = baseUrl + bbox;
//    console.log(fullUrl);
//
//    fetch(fullUrl)
//    .then((response) => response.json())
//    .then((data) => console.log(data[0]));
//
//});
//
//
