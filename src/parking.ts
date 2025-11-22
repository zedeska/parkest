import { LngLat } from "@maptiler/sdk";

export class Parking {
    parkingsDsp : any[] = [];
    parkings : any[] = [];

    getNearParkings(position: LngLat, dspOnly: boolean, radius: number = 3000) {
        let nearbyParkings
        if (!dspOnly) {
            nearbyParkings = this.parkingsDsp.filter(parking => {
                const parkingPos = new LngLat(parking.coordinates.longitude, parking.coordinates.lattitude);
                const distance = position.distanceTo(parkingPos);
                return distance <= radius;
            });
        } else {
            nearbyParkings = this.parkings.filter(parking => {
                const parkingPos = new LngLat(parking.coordinates.longitude, parking.coordinates.lattitude);
                const distance = position.distanceTo(parkingPos);
                return distance <= radius;
            });
        }
        return nearbyParkings;
    }

    getNearestParking(position: LngLat) {
        let nearestParking = null;
        let minDistance = Infinity;

        for (let parking of this.parkings) {
            const parkingPos = new LngLat(parking.coordinates.longitude, parking.coordinates.lattitude);
            const distance = position.distanceTo(parkingPos);
            if (distance < minDistance) {
                minDistance = distance;
                nearestParking = parking;
            }
        }

        return nearestParking;
    }

    async fetchParkings() {
        const response = await fetch('https://maps.eurometropolemetz.eu/public/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=public:pub_tsp_sta&srsName=EPSG:4326&outputFormat=application%2Fjson&cql_lter=id%20is%20not%20null');
        const data = await response.json();
        for (let feature of data.features) {
            if (feature.properties.place_libre === null || feature.properties.place_total === null) {
                this.parkingsDsp.push({
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
                continue;
            };
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