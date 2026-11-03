
    mapboxgl.accessToken = mapToken;
0
    const map = new mapboxgl.Map({
        container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,
    zoom:8
    });

    map.on('load', () => {
        console.log("Map successfully loaded");
    });

    map.on('error', (e) => {
        console.log("Map error:", e.error);
    });



const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Location will be provided after registration<p>`)
        .setMaxWidth("300px"))
    .addTo(map);