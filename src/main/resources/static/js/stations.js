const formInputBounds = document.getElementById('formInputBounds');
const showAllStationsBtn = document.getElementById('showAllStationsBtn');

showAllStationsBtn.addEventListener('click', () => {
// when listener is called, check localStorage for bounds; if exist and match, use cached response
// if != and/or !exist, save new bounds to localStorage, create url, send request, save response


    // make markers for each station

    console.log('show stations called');

    let today = new Date();

    const baseUrl = "https://www.airnowapi.org/aq/data/?"

    let startDate = "startDate=" + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDay() + 'T' + today.getUTCHours();
    let endDate = "&endDate=" + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDay() + 'T' + (today.getUTCHours() + 1);
    let parameters = "&parameters=PM25";
    let bbox = "&BBOX=" + formInputBounds.value;
    let dataType = "&dataType=A";
    let format = "&format=application/json";
    let verbose = "&verbose=1";
    let monitorType = "&monitorType=0";
    let rawConcentrations = "&includerawconcentrations=0";
    let apiKey = "&API_KEY=" + `${airnow.api.key}`;

    const fullUrl = baseUrl + startDate + endDate + parameters + bbox + dataType + format + verbose + monitorType + rawConcentrations + apiKey
    console.log(fullUrl);

    fetch(fullUrl)
    .then((response) => response.json())
    .then((data) => console.log(data));

});
