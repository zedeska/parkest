import * as maptilersdk from '@maptiler/sdk';

class Map {
    map: maptilersdk.Map = {} as maptilersdk.Map;
    private API_KEY: string = '1nbw0HVdWw3MdIEhMg9Z';
    longitude: number = 0;
    latitude: number = 0;
    containerId: string = '';

    constructor(containerId: string) {
        this.containerId = containerId;
        maptilersdk.config.apiKey = this.API_KEY;
    }

    laodMap() {
        this.map = new maptilersdk.Map({
            container: this.containerId, // container's id or the HTML element to render the map
            style: maptilersdk.MapStyle.STREETS,
            geolocateControl: false,
            zoom: 16,
        });

        this.map.on('load', () => {
            this.map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Point',
                        'coordinates': [0, 0]
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
            console.log('Map position update:', latitude, longitude);
            this.latitude = latitude;
            this.longitude = longitude;
            this.map.setCenter([this.longitude, this.latitude]);
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
}

export default Map;