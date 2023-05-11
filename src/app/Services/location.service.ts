import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeolocationService } from './geolocation.service';

const url1 = 'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?';    // Stores first part of api url
const url2 = '&accept-language=en&polygon_threshold=0.0';   // Stores last part of api url
const latParameter = 'lat='; 
const lonParameter = 'lon=';
const andSymbol = '&';

// Stores the api key and host
const options = {
    headers: {
        'X-RapidAPI-Key': '515a574824mshdeb2c896c944361p1d7abajsn0001cd35bba3',
        'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
    }
};

@Injectable({
    providedIn: 'root'
})
export class LocationService 
{
    lat: string = "";
    lon: string = "";
    url: string = "";
    countryCode: string = "";
    result: any;

    constructor(private httpService: HttpClient, private geoLocationService: GeolocationService) { }

    // Gets users location using their coordinates and sets the country code based on the result.
    async getLocation(lat: string, lon: string) 
    {
        this.url = url1 + latParameter + lat + andSymbol + lonParameter + lon + url2;

        try 
        {
            this.result = await this.httpService.get(this.url, options).toPromise();
            this.countryCode = this.result.address.country_code;
        }
        catch (error) 
        {
            console.error(error);
        }
    }

    getCountryCode() 
    {
        return this.countryCode;
    }
}

