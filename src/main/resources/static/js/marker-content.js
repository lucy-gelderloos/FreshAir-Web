const viewBoxOrigin = 0;
const defaultViewBoxWidth = 18;

const green = '#00e400';
const darkGreen = '#009a00';
const yellow = '#ffff00';
const darkYellow = '#b2b200';
const orange = '#ff7e00';
const darkOrange = '#aa5500';
const red = '#ff0000';
const darkRed = '#b70000';
const purple = '#8f3f97';
const darkPurple = '#5b2861';
const maroon = '#7e0023';
const darkMaroon = '#4d0016';

const gray = '#888888';
const darkGray = '#333333';
const themeMarkerFill = '#0B38DB';
const themeMarkerStroke = '#04228F';

function makeUserMarker() {
    let userMarkerWidth = 30
    let center = userMarkerWidth / 2;
    let radius = userMarkerWidth / 3;

    let userMarkerSvgString = "<svg width=\"" + userMarkerWidth + "\" height=\"" + userMarkerWidth + "\" viewBox=\"0 0 " + userMarkerWidth + " " + userMarkerWidth + "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\"><circle cx=\"" + center + "\" cy=\"" + center + "\" r=\"" + radius + "\" fill=\"" + themeMarkerFill + "\" stroke=\"" + themeMarkerStroke + "\" stroke-width=\"2\" /></svg>";

    const parser = new DOMParser();
    const userMarkerSvg = parser.parseFromString(
        userMarkerSvgString,
        "image/svg+xml"
    ).documentElement;

    return userMarkerSvg;
}

function makeStationMarker(aqiDesc, currentAQI) {

    let fillColor = '';
    let strokeColor = '';

    switch (aqiDesc) {
        case 'error':
            fillColor = gray;
            strokeColor = darkGray;
        case 'good':
            fillColor = green;
            strokeColor = darkGreen;
            break;
        case 'moderate':
            fillColor = yellow;
            strokeColor = darkYellow;
            break;
        case 'usg':
            fillColor = orange;
            strokeColor = darkOrange;
            break;
        case 'unhealthy':
            fillColor = red;
            strokeColor = darkRed;
            break;
        case 'very-unhealthy':
            fillColor = purple;
            strokeColor = darkPurple;
            break;
        case 'hazardous':
            fillColor = maroon;
            strokeColor = darkMaroon;
            break;
        default:
            fillColor = null;
            strokeColor = null;
    }

    let viewBoxWidth = defaultViewBoxWidth;

    let viewBoxHeight = viewBoxWidth * 1.8;
    let startXCoord = viewBoxWidth * 0.6;
    let bigAntennaHeight = viewBoxWidth * 0.4;
    let bigAntennaBaseWidth = viewBoxWidth * 0.1;
    let bigAntennaBaseHeight = viewBoxHeight / 15;
    let antennaSpacing = viewBoxWidth * .3;
    let smallAntennaHeight = bigAntennaHeight * .7;
    let smallAntennaWidth = viewBoxWidth * 0.08;
    let smallAntennaToCorner = bigAntennaBaseHeight;
    let boxHeight = viewBoxHeight - bigAntennaHeight - bigAntennaBaseHeight;
    let bigAntennaToCorner = viewBoxWidth * 0.18;

    let svgPathString = `m ${startXCoord}, ${viewBoxOrigin}, v ${bigAntennaHeight} h -${bigAntennaBaseWidth} v ${bigAntennaBaseHeight} h -${antennaSpacing} v -${smallAntennaHeight} h -${smallAntennaWidth} v ${smallAntennaHeight} h -${smallAntennaToCorner} v ${boxHeight} h ${viewBoxWidth} v -${boxHeight} h -${bigAntennaToCorner} v -${bigAntennaBaseHeight} h -${bigAntennaBaseWidth} v -${bigAntennaHeight} z`

    let pinSvgString = "<svg width=\"" + viewBoxWidth + "\" height=\"" + viewBoxHeight + "\" viewBox=\"0 0 " + viewBoxWidth + " " + viewBoxHeight + "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:svg=\"http://www.w3.org/2000/svg\"><defs id=\"defs2\"><clipPath id=\"meterIconClipPath\"><path d=\"" + svgPathString + "\" /></clipPath></defs><g id=\"layer1\"><path id=\"path1712\" style=\"fill:" + fillColor + ";stroke:" + strokeColor + ";stroke-width:1.5;stroke-dasharray:none;stroke-opacity:1;paint-order:fill markers stroke\" d=\"" + svgPathString + "\" clip-path=\"url(#meterIconClipPath)\" /><text x=\"50%\" y=\"65%\" dominant-baseline=\"middle\" text-anchor=\"middle\">" + currentAQI + "</text></g></svg>";

    const parser = new DOMParser();
    const pinSvg = parser.parseFromString(
        pinSvgString,
        "image/svg+xml"
    ).documentElement;

    return pinSvg;
}

export { makeStationMarker, makeUserMarker };