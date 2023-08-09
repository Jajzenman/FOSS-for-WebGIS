console.log("running");
console.log("loaded!");
console.log(maplibregl);

const dropdownSelected = document.getElementById("dropdown");
//const dropdownSelected = document.getElementByTag("option");

const map = new maplibregl.Map({
  container: "map", // container id
  style:
    "https://api.maptiler.com/maps/0527181a-1a35-4cf8-8a4a-b0efb32259d7/style.json?key=7SGo3nVkTl7JQ90xmJ0i", // style URL
  center: [-73.983486, 40.7489], // starting position [lng, lat]
  zoom: 6, // starting zoom
  hash: true,
});

map.once("load", main);

async function main() {
  const schoolGeojson = await axios("../data/hospitals.geojson");

  map.addSource("hospitals-geo-source", {
    type: "geojson",
    data: schoolGeojson.data,
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
        "Crimson",
        "Child Health Center",
        "CornflowerBlue",
        "Diagnostic & Treatment Center",
        "green",
        "Nursing Home",
        "Grey",
        "black",
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#fff",
    },
  });

  console.log(document.getElementById("dropdown").selectedOptions[0].text);

  addEvents();
}

function addEvents() {
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: true,
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
            <center> <a href="https://new.mta.info" target="_blank" >Get bus directions </a> </center>
        `
      )

      .addTo(map);
  });

  /* map.on("mouseleave", "nyc-hospitals", (e) => {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = "initial";
    popup.remove();
  });
*/
  // Function to handle the dropdown selection change
  function handleDropdownChange() {
    let selectedOption =
      document.getElementById("dropdown").selectedOptions[0].text; // Variable to save the selected option
    switch (selectedOption) {
      case "All Centers":
        return map.setFilter("nyc-hospitals", null);
      default:
        return map.setFilter("nyc-hospitals", [
          "==",
          ["get", "facility_type"],
          selectedOption,
        ]);
    }
  }

  // Add event listener to the dropdown
  dropdown.addEventListener("change", handleDropdownChange);

  document.getElementById("fly-to").addEventListener("click", () => {
    map.flyTo({
      center: [-73.976862, 40.739173],
      zoom: 16,
    });
  });
}
