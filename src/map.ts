import * as maptilersdk from '@maptiler/sdk';

class Map {
    map: maptilersdk.Map = {} as maptilersdk.Map;
    private API_KEY: string = '1nbw0HVdWw3MdIEhMg9Z';
    longitude: number = 0;
    latitude: number = 0;
    containerId: string = '';
    markers: maptilersdk.Marker[] = [];
    constructor(containerId: string) {
        this.containerId = containerId;
        maptilersdk.config.apiKey = this.API_KEY;
    }

    loadMap() {
        this.map = new maptilersdk.Map({
            container: this.containerId, // container's id or the HTML element to render the map
            style: maptilersdk.MapStyle.STREETS,
            geolocateControl: false,
            zoom: 16,
            center: [this.longitude, this.latitude]
        });

        this.map.on('load', () => {
            this.map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Point',
                        'coordinates': [this.longitude, this.latitude]
                    }
                });

            this.map.addLayer({
                'id': 'point',
                'source': 'point',
                'type': 'circle',
                'paint': {
                    'circle-radius': 5,
                    'circle-color': '#007cbf'
                }
            });
        });
    }

    setPosition(latitude: number, longitude: number) {
        if (this.map.loaded()) {
            this.latitude = latitude;
            this.longitude = longitude;
            //this.map.setCenter([this.longitude, this.latitude]);
            const source: maptilersdk.GeoJSONSource = this.map.getSource('point') as maptilersdk.GeoJSONSource;
            source.setData({
                'type': 'Point',
                'coordinates': [this.longitude, this.latitude]
            });
        } else {
            setTimeout(() => {
                this.setPosition(latitude, longitude);
            }, 100);
        }
    }

    setLongitudeLatitude(longitude: number, latitude: number) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

    setParkingMarkers(parkings: any[]) {
        this.markers = parkings.map(parking => {
            const popup = new maptilersdk.Popup({ offset: 25 }).setText(
            `${parking.lib} - ${parking.type}\nPlaces disponibles: ${parking.place_dispo}/${parking.place_tot}\nCoût: ${parking.cout}`
        );
            return new maptilersdk.Marker()
            .setLngLat([parking.coordinates.longitude, parking.coordinates.lattitude])
            .setPopup(popup)
            .addTo(this.map);
        });
    }
}

export default Map;