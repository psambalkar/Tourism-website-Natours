export const displayMap=locations=>{
mapboxgl.accessToken = 'pk.eyJ1IjoicHNhbWJhbGthciIsImEiOiJja2ZzM3J5MnUxODJ2MnJwYWt4eXZyb3UyIn0.78Lj_NxDd_jz9dzmAPVT0g';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/psambalkar/ckfs45dqg0jqz19ti18kkfaci',
scrollZoom:false
// center:[-118.113,34.11],
// zoom:4
});
const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
 }
