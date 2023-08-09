console.log("running");
console.log("loaded!");
console.log(maplibregl);

let hospitalsFilter = [
  [1, "All Centers", "FB_WR_Population", "Foreign Born World Population"],
  [2, "Acute Care Hospital", "FB_WR_pctEurope", "Foreign Born Pct from Europe"],
  [3, "Child Health Center", "FB_WR_pctAsia", "Foreign Born Pct from Asia"],
  [
    4,
    "Diagnostic & Treatment Center",
    "FB_WR_pctAfrica",
    "Foreign Born Pct from Africa",
  ],
  [5, "Nursing Home", "FB_WR_pctOceania", "Foreign Born Pct from Oceania"],
];
let StartingField = "All Centers";
let ChosenField = 1;
let ChosenFieldName = "FB_WR_Population";
let ChosenField_h2 = "Foreign Born Population";
let filteredData = [];
let unFilteredData = [];
let clone;
let dropBoxState;
let elem;

const map = new maplibregl.Map({
  container: "map", // container id
  style:
    "https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i", // style URL
  center: [-73.976862, 40.739173], // starting position [lng, lat]
  zoom: 4, // starting zoom
  hash: true,
});

map.once("load", main);

async function main() {
  const hospitalsGeojson = await axios("../data/hospitals.geojson");

  map.addSource("hospitals-geo-source", {
    type: "geojson",
    data: hospitalsGeojson.data,
  });

  map.addLayer({
    id: "nyc-hospitals",
    source: "hospitals-geo-source",
    type: "circle",
    //   filter: ['==', ['get','facility_type'], 'Acute Care Hospital'],
    paint: {
      "circle-color": [
        "match",
        ["get", "facility_type"],
        "Acute Care Hospital",
        "purple",
        "Child Health Center",
        "red",
        "Diagnostic & Treatment Center",
        "green",
        "Nursing Home",
        "orange",
        "black",
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#fff",
    },
  });

  map.setFilter("nyc-hospitals", [
    "==",
    ["get", "facility_type"],
    "Acute Care Hospital",
  ]);

  addEvents();
}

function addEvents() {
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on("mouseenter", "nyc-hospitals", (e) => {
    // console.log()
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "pointer";
    const coordinates = e.features[0].geometry.coordinates.slice();
    const props = e.features[0].properties;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    console.log(props);
    popup
      .setLngLat(coordinates)
      .setHTML(
        `
            <div class='popup-style'>
            <b>${props.facility_name}</b>
            <br>
            ${props.facility_type}
            </div>
            `
      )
      .addTo(map);
  });

  map.on("mouseleave", "nyc-hospitals", (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "initial";
    popup.remove();
  });

  document.getElementById("fly-to").addEventListener("click", () => {
    map.flyTo({
      center: [-73.979916628238, 40.739173],
      zoom: 16,
    });
  });
}
