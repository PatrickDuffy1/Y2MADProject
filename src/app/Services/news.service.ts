import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

const apiUrl: string = "https://newsdata.io/api/1/news?apikey=pub_21745d41492112af662ebe93dc5a90a167e17";   // Stores api url and api key.
const extraParameter: string = "&"; // Used in the request string when adding a new parameter.
const equalsSymbol: string = "=";   // Used in the request string when setting a parameter equal to a value.
const parameters: string[] = ["country", "category"];   // Array of the two parameters that can be used in this app.

// Array of all of the categories.
const categories: string[] = ['All', 'top', 'entertainment', 'environment', 'food', 'health', 'politics', 'science', 'sports', 'technology', 'business', 'tourism', 'world'];

@Injectable({
    providedIn: 'root'
})

export class NewsService 
{
    constructor(private http: HttpClient, private storage: Storage) { }
    requestString: string = apiUrl; // String that will be used to make the api request.
    temp: any = [];

    // Array of the articles from category/country combinations that have already been called by the api.
    // If the user requests a category/country combination that is already stored in the array, the stored version will be used
    // instead of making a call to the api (if the user refreshes the page a new api call will be made). Using the stored version
    // reduces the number of api calls that have to be made which is important because there is a limit of 200 api calls per day.
    savedApiCalls: { countryCode: string, category: number, lastUpdated: any, articlesArray: any }[] = [{ countryCode: "0", category: 0, lastUpdated: "0", articlesArray: 0 }];
    jsonStr: any; // String that store json data.

    // Checks if the category/country combination is stored in savedApiCalls.
    // If not, make api call using requestString and returns the result
    // If yes, returns null.
    getNews(countryCode: string, categoryIndex: number, apiIndex: number): Observable<any> 
    {
        if (apiIndex == -1) 
        {
            this.requestString = apiUrl;
            this.requestString += this.addParameter(0, countryCode);    // Adds the country the user wishes to get news articles for to requestString. 

            // Adds the category to requestString if the category chosen 
            // was not "All News" (category is not added as a parameter when searching for all news).
            if (categoryIndex != 0) 
            {
                this.requestString += this.addParameter(1, categories[categoryIndex]);
            }

            this.temp = this.http.get(this.requestString);    // Calls api using requestString.
        }

        return this.temp;
    }

    async loadSavedApiCallsFromStorage() 
    {
        await this.storage.create();
        this.savedApiCalls = await this.storage.get('savedApiCallsStorage');
    }

    async saveSavedApiCallsToStorage() 
    {
        await this.storage.create();
        await this.storage.set('savedApiCallsStorage', this.savedApiCalls);
    }

    // Checks if a specific category/country combination is stored in savedApiCalls and returns its index if found.
    checkIfSaved(countryCode: string, categoryIndex: number) 
    {
        this.temp = null;
        let index = -1;

        for (let i = 0; i < this.savedApiCalls.length; i++) 
        {
            if (this.savedApiCalls[i].countryCode == countryCode && this.savedApiCalls[i].category == categoryIndex) 
            {
                this.temp = this.savedApiCalls[i].articlesArray;
                index = i;
                break;
            }
        }

        return index;
    }

    // Correctly formats parameter so that it can be added to requestString.
    addParameter(parameterIndex: number, userChoice: string): string 
    {
        return extraParameter + parameters[parameterIndex] + equalsSymbol + userChoice;
    }

    getCategoryArray() 
    {
        return categories;
    }

    getCategoryByCategoryIndex(index: number): string 
    {
        return categories[index];
    }

    // Deletes all the category/country combinations in savedApiCalls by setting it to an empty array.
    // Saves the empty array to storage.
    clearSavedApiCalls() 
    {
        this.savedApiCalls = [];
        this.saveSavedApiCallsToStorage();
    }

    // Searches for then deletes a specific category/country combination from savedApiCalls if found.
    // Saves the updated array to storage.
    deleteSpecificSavedApiCall(countryCode: string, categoryIndex: number) 
    {
        for (let i = 0; i < this.savedApiCalls.length; i++) 
        {
            if (this.savedApiCalls[i].countryCode == countryCode && this.savedApiCalls[i].category == categoryIndex) 
            {
                this.savedApiCalls.splice(i, 1);
            }
        }

        this.saveSavedApiCallsToStorage();
    }

    getSpecficSavedApiCallByNumber(index: number): any 
    {
        return this.savedApiCalls[index];
    }

    async getSpecficSavedApiCall(countryCode: string, categoryIndex: number) 
    {
        let temp = null;
        await this.loadSavedApiCallsFromStorage();

        for (let i = 0; i < this.savedApiCalls.length; i++) 
        {
            if (this.savedApiCalls[i].countryCode == countryCode && this.savedApiCalls[i].category == categoryIndex) 
            {
                temp = this.savedApiCalls[i].articlesArray;
            }
        }

        return temp;
    }

    // Recieves the savedApiCalls array from HomePage and sets this savedApiCalls array to it. Saves the updated array to storage.
    setSavedApiCalls(input: any) 
    {
        this.savedApiCalls = input;
        this.saveSavedApiCallsToStorage();
    }

    getSavedApiCalls() 
    {
        return this.savedApiCalls;
    }

    // Searches savedApiCalls for a specific category/country combination and 
    // returns the last time that category/country combination was updated.
    async getLastTimeUpdated(countryCode: string, categoryIndex: number) 
    {
        let lastTimeUpdated: any;
        await this.loadSavedApiCallsFromStorage();

        for (let i = 0; i < this.savedApiCalls.length; i++) 
        {
            if (this.savedApiCalls[i].countryCode == countryCode && this.savedApiCalls[i].category == categoryIndex) 
            {
                lastTimeUpdated = this.savedApiCalls[i].lastUpdated;
                break;
            }
        }

        return lastTimeUpdated;
    }
}


