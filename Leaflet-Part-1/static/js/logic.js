// Creating our initial map object:
let myMap = L.map("map").setView([40,-110],5);


// Adding a tile layer (the grey background) to our map:
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(response){
    var data = {
        "type": response.FeatureCollection,
        "features": response.features
    };
    createMarker(data);
});

// Create getColor function for marker color by depth value
function getColor(d){
    return d>= 90 ? "#003f5c":
    d>= 70 ? "#444e86":
    d>= 50 ? "#955196":
    d>= 30 ? "#dd5182":
    d>= 10 ? "#ff6e54":
             "#ffa600";
}

// Circle marker color by depth, size by magnitude
function createMarker(data){
    geojsonLayer = L.geoJson(data, {
        
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                color: "black",
                weight: 1,
                fillColor: getColor(feature.geometry.coordinates[2]), // Call getColor function
                radius: feature.properties.mag*3, 
                fillOpacity: 0.5,
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>Magnitude Level: ${feature.properties.mag}</h3><hr>
                             <p>Location: ${feature.properties.place}</p>
                             <p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
    }).addTo(myMap);
}
// Create legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [-10,10,30,50,70,90];
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:'+ getColor(grades[i] + 1) +'"></i> ' + 
        grades[i] + (grades[i + 1] ? '-' + grades[i + 1] + '<br>' : '+') 
    }
return div;
};

legend.addTo(myMap);