let map = 0;
let markers = [];


const loadMap = () => {
    map = L.map('map').setView([41, -74], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    loadPlaces();
}


const addPlace = async () => {
    try {
        const address = document.querySelector("#address").value;
        if (!address) {
            console.error('Address field is empty');
            return;
        }
        const response = await axios.post('/places', { address: address });
        await loadPlaces();

        const lat = response.data.latitude;
        const lng = response.data.longitude;
        document.querySelector("#address").value = "";

        map.flyTo(new L.LatLng(lat, lng));
    } catch (error) {
        console.error('Failed to add place:', error);
        map.flyTo(new L.LatLng(0, 0)); 
    }
};


const loadPlaces = async () => {
    try {
        const response = await axios.get('/places');
        const places = response.data;  

       
        markers.forEach(marker => map.removeLayer(marker));
        markers = []; 

      
        for (const place of places) {
           
            let marker = L.marker([place.latitude, place.longitude]).addTo(map)
                .bindPopup(`<b>${place.address}</b>`);
            markers.push(marker);
        }
    } catch (error) {
        console.error('Failed to load places:', error);
    }
};


function flyToAddress(element) {
    const lat = element.getAttribute('data-lat');
    const lng = element.getAttribute('data-lng');

    if (lat && lng) {
        map.flyTo(new L.LatLng(lat, lng), 13); 
    } else {
        console.error('Missing latitude or longitude data on this element');
    }
}
