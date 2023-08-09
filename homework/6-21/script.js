console.log("loaded");
// latitude, longtitude, zoom
let map = L.map("map").setView([40.7, -73.7], 11);

//http://maps.stamen.com/#terrain/12/37.7706/-122.3782
const baseLayers = {
  terrain: L.tileLayer(
    "https://tile.memomaps.de/tilegen/{z}/{x}/{y}.png",
    //   "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
    {
      maxZoom: 19,
      attribution:
        '&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }
  ),
  osm: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }),
};

baseLayers["terrain"].addTo(map);
baseLayers["osm"].addTo(map);

const layerControl = L.control.layers(baseLayers).addTo(map);

/* L.tileLayer(basemap_urls.terrain, {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
 */
const marker = L.marker([40.74860435245981, -73.98388894156163]).addTo(map);

const message = "hello";

//marker.bindPopup("<b>CUNY GC</b>", $(message));
marker.bindPopup("<b>CUNY GC</b>");
//////// Add Subways
///https://leafletjs.com/examples/geojson/
///https://axios-http.com/
///Live Server

// const subways = axios('../site/data/subways.geojson').then(resp => {
//     console.log(resp);
//     L.geoJSON(resp.data, {
//         style: { color: "#ff0000" }
//     }).addTo(map);
// });

//Style hospitals
//const hospitals = axios("https://data.cityofnewyork.us/resource/f7b6-v6v3.geojson").then((resp) => {
const hospitals = axios("../data/hospitals.geojson").then((resp) => {
  L.geoJSON(resp.data, {
    style: function (feature) {
      switch (feature.properties.facility_type) {
        case "Acute Care Hospital":
          return { color: "blue", weight: 5 };
        case "Child Health Center":
          return { color: "orange", weight: 5 };
        case "Diagnostic & Treatment Center":
          return { color: "red", weight: 5 };
        case "Nursing Home":
          return { color: "green", weight: 5 };
        default:
          return { color: "black", weight: 5 };
      }
    },

    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.facility_type)
        layer.bindPopup(feature.properties.facility_type);
    },
  })
    .addTo(map)
    .bringToFront();
});

/* 
//Style subways
const subways = axios("../site/data/subways.geojson").then((resp) => {
  L.geoJSON(resp.data, {
    style: function (feature) {
      switch (feature.properties.rt_symbol) {
        case "A":
        case "C":
        case "E":
          return { color: "blue", weight: 5 };
        case "B":
        case "M":
        case "D":
          return { color: "orange", weight: 5 };
        case "N":
        case "Q":
        case "R":
        case "W":
          return { color: "yellow", weight: 5 };
        case "1":
        case "2":
        case "3":
          return { color: "red", weight: 5 };
        case "J":
        case "Z":
          return { color: "brown", weight: 5 };
        case "4":
        case "5":
        case "6":
          return { color: "green", weight: 5 };
        case "7":
          return { color: "purple", weight: 5 };
        case "G":
          return { color: "lightgreen", weight: 5 };
        case "S":
        case "L":
          return { color: "gray", weight: 5 };
        default:
          return { color: "black", weight: 5 };
      }
    },

    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.rt_symbol)
        layer.bindPopup(feature.properties.rt_symbol);
    },
  })
    .addTo(map)
    .bringToBack();
});
 */
//Add pizza places
//Set Z Index
const pizza = axios("../data/pizza.geojson").then((resp) => {
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
  };

  L.geoJSON(resp.data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
      }
    },
  })
    .addTo(map)
    .bringToFront();

  const points = resp.data.features.map(
    (f) => new L.LatLng(f.geometry.coordinates[1], f.geometry.coordinates[0])
  );

  var line = L.polyline(points, { snakingSpeed: 5 });
  line.addTo(map).snakeIn();
});
// 'Walking area
const walking = axios("../data/walk-area.geojson").then((resp) => {
  L.geoJSON(resp.data, {
    style: { opacity: 0.95, color: "#000", weight: 2 },
  })
    .addTo(map)
    .bringToBack();
});
console.log(hospitals);
