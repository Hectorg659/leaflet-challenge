// Storing our API endpoint as URL
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a get request to the URL
d3.json(URL).then(function(EQuakeData) {
    console.log(EQuakeData);
    createMap(EQuakeData.features);
});

// Define the createMap function
function createMap(response) {
    // Creating map
    var centerCoordinates = [37.0902, -110.7129];
    var mapZoom = 5;

    //Map Options
    var myMap = L.map("map", {
        center: centerCoordinates,
        zoom: mapZoom
    });

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // Create a GeoJSON layer containing the features array on the response object
    L.geoJSON(response, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 0.3,
                opacity: 0.5,
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature,
    }).addTo(myMap);

    // Binding a pop-up to each layer
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<strong>Place: </strong>${feature.properties.place}<br><strong>Magnitude: </strong>${feature.properties.mag}<br><strong>Depth: </strong>${feature.geometry.coordinates[2]}`);
    }

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var depth = [-10, 10, 30, 50, 70, 90];
        var labels = [];
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";
        

        // Go through each magnitude item to label and color the legend
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
                depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // Add the legend control to the map
    legend.addTo(myMap);
}

// Function to get color based on depth
function getColor(depth) {
    return depth >= 90 ? "#FF0D0D" :
        depth < 90 && depth >= 70 ? "#FF4E11" :
        depth < 70 && depth >= 50 ? "#FF8E15" :
        depth < 50 && depth >= 30 ? "#FFB92E" :
        depth < 30 && depth >= 10 ? "#ACB334" :
                                    "#69B34C";
}

// Function to calculate marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Function to calculate color based on depth
function magColor(depth) {
    return getColor(depth);
}
