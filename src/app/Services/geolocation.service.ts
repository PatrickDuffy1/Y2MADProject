import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Storage } from '@ionic/storage-angular';

@Injectable({
    providedIn: 'root'
})
export class GeolocationService 
{
    coordinates: any = "";
    lat: string = "";
    lon: string = "";

    constructor(private storage: Storage) { }

    // Gets the current coordinates of the user.
    async getGPS() 
    {
        this.coordinates = await Geolocation.getCurrentPosition();
        this.lat = this.coordinates.coords.latitude;
        this.lon = this.coordinates.coords.longitude;
    }

    getCoordinates() 
    {
        this.getGPS();
    }

    async saveCoordinatesToStorage() 
    {
        await this.getGPS();

        this.storage.create();
        await this.storage.set('lat', this.lat);
        await this.storage.set('lon', this.lon);
    }
}
