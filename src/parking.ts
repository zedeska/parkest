import { LngLat } from "@maptiler/sdk";

export class Parking {
    parkings : any[] = [];

    getNearParkings(position: LngLat, radius: number = 2000) {
        const nearbyParkings = this.parkings.filter(parking => {
            const parkingPos = new LngLat(parking.coordinates.longitude, parking.coordinates.lattitude);
            const distance = position.distanceTo(parkingPos);
            return distance <= radius;
        });
        return nearbyParkings;
    }

    async fetchParkings() {
        const response = await fetch('https://maps.eurometropolemetz.eu/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:pub_tsp_sta&srsName=EPSG:4326&outputFormat=application%2Fjson&cql_lter=id%20is%20not%20null');
        const data = await response.json();
        for (let feature of data.features) {
            this.parkings.push({
                id: feature.id,
                type: feature.properties.typ,
                lib: feature.properties.lib,
                place_tot: feature.properties.place_total,
                place_dispo: feature.properties.place_libre,
                cout: feature.properties.cout,
                coordinates: {
                    lattitude: feature.geometry.coordinates[1],
                    longitude: feature.geometry.coordinates[0]
                }
            });
        }
    }
}