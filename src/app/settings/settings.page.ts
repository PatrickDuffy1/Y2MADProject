import { Component } from '@angular/core';
import { CountriesService } from '../Services/countries.service';
import { Storage } from '@ionic/storage-angular';
import { GeolocationService } from '../Services/geolocation.service';
import { LocationService } from '../Services/location.service';

const defaultCountry: string = "ie";    // Default country set to Ireland

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage 
{
    extraCountriesEnabled: boolean = false; // If enabled, displays list of all countries instead of the four default(au, ie, gb, us).
    countryListHidden: boolean = true;  // Hides list of all countries if true.
    shortCountryListHidden: boolean = true; // Hides list of the four default countries if true.
    displayCountriesMessage: string = "Change countries";
    currentCountryCode: string = "";
    currentCountryIndex: number = 65;   // Index of the country in the countriesList and countriesCodesList (65 = Ireland/ie).
    showAllCountries: boolean = false;  // True if user has chosen to display all countries
    currentShortCountryListIndex: number = 2; // Index of the country in the shortCountriesList and shortCountriesCodesList (2 = Ireland/ie).
    countriesList: string[] = this.countriesService.getCountriesList(); // Array that stores all of the country names
    countriesCodesList: string[] = this.countriesService.getCountryCodesList(); // Array that stores all of the country codes
    shortCountriesList: string[] = this.countriesService.getShortCountriesList();   // Array that stores the four default country names
    shortCountriesCodesList: string[] = this.countriesService.getShortCountryCodesList();   // Array that stores the four default country codes
    showProgressBar: boolean = false;

    // When offline mode is enabled only category/country combinations that are stored in the savedApiCalls array can be used.
    // No new api calls can be made, so any category/country combinations that are not in the array will display a message
    // telling the user that there are no articles. This mode is useful for preventing unnecessary api calls.
    offlineModeEnabled = false;

    // True if the user choses to turn location. The location can be used to find out what country
    // the user is in and set the country that api is getting news from to that country.
    locationEnabled = false;
    hideCoordinates = !this.locationEnabled;
    lat: string = "";   // String storing the users Latitude.
    lon: string = "";   // String storing the users Longitude

    constructor(private countriesService: CountriesService, private storage: Storage, private geolocationService: GeolocationService, private locationService: LocationService) { }

    async ionViewWillEnter() 
    {
        await this.onStartOrEnd();
        this.loadOfflineModeStatusFromStorage();

        this.hideCoordinates = !this.locationEnabled;
        this.currentCountryIndex = this.countriesService.getIndexByCountryCode(this.currentCountryCode);

        // If the currentCountryIndex is also a country that is in the array of four 
        // default countries, the inex of that country in the shortlist will be found.
        this.countriesService.setShortListFromCountryIndex(this.currentCountryIndex);
    }

    ionViewWillLeave() 
    {
        this.onStartOrEnd();
    }

    // Initilises some of the varibles in the page.
    async onStartOrEnd() 
    {
        await this.loadCountryCodeFromStorage();

        // Checks if variable is null and gives it a valid value if true.
        if(this.currentCountryCode == null)
        {
            this.currentCountryCode = defaultCountry;
        }

        this.displayCountriesMessage = "Change countries";
        this.countryListHidden = true;
        this.shortCountryListHidden = true;
        this.showAllCountries = false;
        this.extraCountriesEnabled = false;
    }

    async loadCountryCodeFromStorage() 
    {
        this.storage.create();
        this.currentCountryCode = await this.storage.get('countryCode');
    }

    // Sets variables so that when btnDisplayCountries is clicked, either all countries 
    // will be displayed or just the four default countries will be displayed.
    toggleExtraCountries() 
    {
        this.showAllCountries = !this.showAllCountries;
        this.displayCountriesMessage = "Change countries";
        this.countryListHidden = true;
        this.shortCountryListHidden = true;
    }

    // Saves the status of offline mode to storage when the toggle is clicked.
    toggleOfflineMode() 
    {
        this.saveOfflineModeStatusToStorage();
    }

    // Gets user coordinates when toggle is clicked.
    async toggleLocationStatus() 
    {
        this.hideCoordinates = !this.hideCoordinates;

        if (this.locationEnabled == true) 
        {
            await this.geolocationService.saveCoordinatesToStorage();
            await this.loadCoordinatesFromStorage();

            this.lat = this.geolocationService.lat;
            this.lon = this.geolocationService.lon;
        }
    }

    // Finds what country the user is in based on their coordinates and stores the resulting country code in storage.
    async findLocation() 
    {
        this.locationEnabled = false;
        this.showProgressBar = true;

        await this.loadCoordinatesFromStorage();
        await this.locationService.getLocation(this.lat, this.lon);
        this.currentCountryCode = await this.locationService.getCountryCode();

        // Checks if variable is null and gives it a valid value if true. 
        if (this.currentCountryCode.length == 0) 
        {
            this.currentCountryCode = defaultCountry;
        }

        this.currentCountryIndex = this.countriesService.getIndexByCountryCode(this.currentCountryCode);
        this.countriesService.setShortListFromCountryIndex(this.currentCountryIndex);

        await this.storage.create();
        await this.storage.set("countryCode", this.currentCountryCode);

        this.showProgressBar = false;
    }

    async saveOfflineModeStatusToStorage() 
    {
        this.storage.create();
        await this.storage.set('offlineModeEnabled', this.offlineModeEnabled);
    }

    async loadOfflineModeStatusFromStorage() 
    {
        this.storage.create();
        const offlineModeEnabledFromStorage = await this.storage.get('offlineModeEnabled');
    
        if (offlineModeEnabledFromStorage === null || offlineModeEnabledFromStorage === undefined) 
        {
            // Use the default value of false if offlineModeEnabled is null or undefined in storage
            this.offlineModeEnabled = false;
        } 
        else 
        {
            // Use the value from storage if it is not null or undefined
            this.offlineModeEnabled = offlineModeEnabledFromStorage;
        }
    }
    

    // Button which gives users option to show list of countries or hide list of countries.
    btnDisplayCountries() 
    {
        if (this.displayCountriesMessage == "Change countries") 
        {
            this.displayCountriesMessage = "Hide";

            if (this.showAllCountries == false) 
            {
                this.shortCountryListHidden = false;
            }
            else 
            {
                this.countryListHidden = false;
            }
        }
        else 
        {
            this.displayCountriesMessage = "Change countries";
            this.countryListHidden = true;
            this.shortCountryListHidden = true;
        }
    }

    // Sets the currentCountryIndex of the current country based on its index in the countriesCodesList.
    async setCountryByCountryIndex(index: number) 
    {
        this.currentCountryIndex = index;
        this.currentCountryCode = this.countriesCodesList[index];

        await this.storage.create();
        await this.storage.set("countryCode", this.currentCountryCode);
    }

    // Sets the currentCountryIndex of the current country based on its index in the short list.
    setShortListCountry(index: number) 
    {
        this.currentCountryIndex = this.countriesService.setCountryIndexFromShortList(index);
        this.currentShortCountryListIndex = index;
        this.setCountryByCountryIndex(this.currentCountryIndex);
    }

    async loadCoordinatesFromStorage() 
    {
        this.storage.create();
        this.lat = await this.storage.get('lat');
        this.lon = await this.storage.get('lon');
    }

}
