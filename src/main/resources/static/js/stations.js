const findNearbyStationsForm = document.getElementById('findNearbyStationsForm');
const formInputBounds = document.getElementById('formInputBounds');

findNearbyStationsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const baseUrl = "http://localhost:8080/visible-stations/"

    let bbox = formInputBounds.value;

    const fullUrl = baseUrl;
    console.log(fullUrl);

    fetch(fullUrl)
    .then((response) => response.json())
    .then((data) => console.log(data));

});


