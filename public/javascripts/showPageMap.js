// const airport = require("../../models/airport");
mapboxgl.accessToken = mapToken; 
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: airport.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(airport.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${airport.name}</h3>`
        )
)
.addTo(map)