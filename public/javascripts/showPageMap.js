// const airport = require("../../models/airport");

mapboxgl.accessToken = mapToken; 
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: airport.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

new mapboxgl.Marker()
.setLngLat(airport.geometry.coordinates)
.addTo(map)