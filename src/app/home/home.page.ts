import { Component } from '@angular/core';
import { NewsService } from '../Services/news.service';
import { Observable, subscribeOn } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { CountriesService } from '../Services/countries.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

const defaultCountry: string = "ie";    // Default country set to Ireland

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage 
{
    newsStoriesArray: any = []; // Array that stores the articles from the api
    jsonStr: any;   // String that stores the json from the api
    categories: string[] = this.newsService.getCategoryArray(); // Array of news categories e.g. "Health", "Technology" etc.
    currentCategoryIndex: number = 0;   // Index of the current category selected in the categories array
    categoryName: string = this.newsService.getCategoryByCategoryIndex(this.currentCategoryIndex); // Name of the current category
    showProgressBar: boolean = false;
    countryCode: string = defaultCountry;   // Country code of the current selected country
    countryName: string = this.countriesService.getCountryNameByCountryCode(this.countryCode);  // Name of the current selected country
    lastTimeUpdated: any;   // Variable that stores the last time the current category/country combination was called by the api

    // Array of the articles from category/country combinations that have already been called by the api.
    // If the user requests a category/country combination that is already stored in the array, the stored version will be used
    // instead of making a call to the api (if the user refreshes the page a new api call will be made). Using the stored version
    // reduces the number of api calls that have to be made which is important because there is a limit of 200 api calls per day.
    savedApiCalls: { countryCode: string, category: number, lastUpdated: any, articlesArray: any }[] = []; 

    // When offline mode is enabled only category/country combinations that are stored in the savedApiCalls array can be used.
    // No new api calls can be made, so any category/country combinations that are not in the array will display a message
    // telling the user that there are no articles. This mode is useful for preventing unnecessary api calls.
    offlineModeEnabled: boolean = false;
    hideOfflineModeMessage: boolean = !this.offlineModeEnabled;
    hideNoArticlesMessage: boolean = true;
    savedArticles: any[] = [];  // Array of articles that the user has added to their "Saved Articles" list.

    constructor(private newsService: NewsService, private menuController: MenuController, private storage: Storage, private countriesService: CountriesService, private navCtrl: NavController, private alertCtrl: AlertController) { }

    async ionViewWillEnter() 
    {
        await this.loadCountryInfoFromStorage();
        await this.newsService.loadSavedApiCallsFromStorage();
        await this.loadOfflineModeStatusFromStorage();

        // If the savedApiCalls array is null, adds an element with values of 0.
        // This is used to avoid problems when interacting with a null array.
        if (this.newsService.savedApiCalls == null) 
        {
            this.savedApiCalls.push({ countryCode: "0", category: 0, lastUpdated: "0", articlesArray: 0 });
            await this.newsService.setSavedApiCalls(this.savedApiCalls);    // Stores the newly updated array to storage.
        }

        // Checks if variable is null and gives it a valid value if true. 
        if (this.currentCategoryIndex == null) 
        {
            this.currentCategoryIndex = 0;
        }

        // Checks if variable is null and gives it a valid value if true.
        if (this.countryCode.length == 0 || this.countryCode == null) 
        {
            this.countryCode = defaultCountry;
        }

        this.hideOfflineModeMessage = !this.offlineModeEnabled;
        this.countryName = this.countriesService.getCountryNameByCountryCode(this.countryCode);

        this.getNewsArticles();
        this.categoryName = this.newsService.getCategoryByCategoryIndex(this.currentCategoryIndex);
    }

    async loadCountryInfoFromStorage() 
    {
        this.storage.create();
        this.currentCategoryIndex = await this.storage.get('categoryIndex');
        this.countryCode = await this.storage.get('countryCode');

         // Checks if variable is null and gives it a valid value if true.
        if (this.countryCode == null) 
        {
            this.countryCode = defaultCountry;
        }

        this.countryName = this.countriesService.getCountryNameByCountryCode(this.countryCode);
    }


    // Recieves array of articles offlineModeEnabled is false. Displays message if offlineModeEnabled is true. 
    async getNewsArticles() 
    {
        this.showProgressBar = true;
        this.hideNoArticlesMessage = true;

        if (this.offlineModeEnabled == false) 
        {
            // Checks if current category/country combination is already stored in savedApiCalls.
            // If not (try), make api call and store the articles from the result in newsStoriesArray.
            // if yes (catch), get the result from savedApiCalls and store the result in newsStoriesArray.
            try 
            {
                // Gets index of category/country combination in savedApiCalls. Gets -1 if it is not in savedApiCalls.
                let apiIndex: number = this.newsService.checkIfSaved(this.countryCode, this.currentCategoryIndex);

                // Recives result of the api call, recives null if the category/country combination was already in savedApiCalls.
                const json = await this.newsService.getNews(this.countryCode, this.currentCategoryIndex, apiIndex).toPromise();
                this.jsonStr = json;
                this.newsStoriesArray = this.jsonStr.results;   // Stores the articles from the json in newsStoriesArray.
                let currentTime = new Date();   // Gets the current time.
                this.savedApiCalls = this.newsService.getSavedApiCalls(); // Gets the most recent version of savedApiCalls from newsService.

                
                this.lastTimeUpdated = currentTime.toLocaleString();
                // Pushes the new category/country combination of articles to savedApiCalls.
                this.savedApiCalls.push({ countryCode: this.countryCode, category: this.currentCategoryIndex, lastUpdated: currentTime.toLocaleString(), articlesArray: this.newsStoriesArray });
                this.newsService.setSavedApiCalls(this.savedApiCalls);  // // Stores the newly updated savedApiCalls array to storage.
            } 
            catch (error) 
            {
                // If the category/country combination was already stored, get the result 
                // from savedApiCalls and store the result in newsStoriesArray.
                this.newsStoriesArray = await this.newsService.getSpecficSavedApiCall(this.countryCode, this.currentCategoryIndex);

                console.log("1. " + this.lastTimeUpdated);
                // Stores the last time the current category/country combination made an api call (how up to date the displayed articles are).
                this.lastTimeUpdated = await this.newsService.getLastTimeUpdated(this.countryCode, this.currentCategoryIndex);
                console.log("2. " + this.lastTimeUpdated);
            }
        }
        else    // If in offline mode
        {
            // If the category/country combination was already stored, get the result 
            // from savedApiCalls and store the result in newsStoriesArray.
            if (this.newsStoriesArray == null) 
            {
                // If the category/country combination was not in savedApiCalls, display message to user.
                this.hideNoArticlesMessage = false;
            }
            else
            {
                this.newsStoriesArray = await this.newsService.getSpecficSavedApiCall(this.countryCode, this.currentCategoryIndex);
                
                console.log("3. " + this.lastTimeUpdated);
                // Stores the last time the current category/country combination made an api call (how up to date the displayed articles are).
                this.lastTimeUpdated = await this.newsService.getLastTimeUpdated(this.countryCode, this.currentCategoryIndex);
                console.log("4. " + this.lastTimeUpdated);
            }
        }

        this.showProgressBar = false;   
    }

    // Sets the current catogory index based on the button clicked and saves it to storage.
    btnCategoryClicked(userChoice: number) 
    {
        this.currentCategoryIndex = userChoice;
        this.categoryName = this.newsService.getCategoryByCategoryIndex(this.currentCategoryIndex);
        this.saveCategoryIndexToStorage();
        this.getNewsArticles(); // Calls getNewsArticles based on the new category
        this.menuController.close();    // Closes menu if a category button has been clicked.
    }

    // Saves the current category index to storage.
    async saveCategoryIndexToStorage() 
    {
        this.storage.create();
        this.currentCategoryIndex = await this.storage.set('categoryIndex', this.currentCategoryIndex);
    }

    // When page is reloaded, gives user options based on the status of offlineModeEnabled.
    reloadPageEvent(event: any) 
    {
        this.showProgressBar = true;

        if (this.offlineModeEnabled == false) 
        {
            this.presentRefreshAlert(); // Displays an alert asking user to confirm if they wish to refresh the page.
        }
        else 
        {
            this.presentCantRefreshAlert(); // Displays an alert telling users that they can't refresh in offline mode.
        }
        
        event.target.complete();
        this.showProgressBar = false;
    }

    // Deletes the current category/country combination and makes a new api call for the current category/country combination.
    reloadPage() 
    {
        this.newsService.deleteSpecificSavedApiCall(this.countryCode, this.currentCategoryIndex);
        this.getNewsArticles();
        this.categoryName = this.newsService.getCategoryByCategoryIndex(this.currentCategoryIndex);
    }

    // Displays an alert asking user to confirm if they wish to refresh the page and calls reloadPage if they choose to refresh it.
    async presentRefreshAlert() 
    {
        const alert = await this.alertCtrl.create({
            header: 'Refresh Article',
            message: 'Are you sure you wish to refresh articles?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Refresh',
                    handler: () => {
                        this.reloadPage();
                    }
                }
            ]
        });

        await alert.present();
    }

    // Displays an alert telling users that they can't refresh in offline mode.
    async presentCantRefreshAlert() 
    {
        const alert = await this.alertCtrl.create({
            header: 'Alert',
            subHeader: 'Important message',
            message: 'Cannot refresh page in offline mode',
            buttons: ['OK'],
        });

        await alert.present();
    }

    async loadOfflineModeStatusFromStorage() 
    {
        this.offlineModeEnabled = await this.storage.get('offlineModeEnabled');

        // Checks if variable is null and gives it a valid value if true. 
        if (this.offlineModeEnabled == null) 
        {
            this.offlineModeEnabled = false;
        }
    }

    // Save the selected article to storage and goes to the article page, which is where the selected article will be displayed.
    goToArticle(index: number) 
    {
        let temp = this.newsStoriesArray[index];
        this.saveCurrentArticle(temp);
        this.navCtrl.navigateForward('/article');
    }

    async saveCurrentArticle(temp: any) 
    {
        this.storage.create();
        await this.storage.set('currentArticle', temp);
    }

    // Hides the category menu.
    hideMenu() 
    {
        this.menuController.close();
    }

    // Adds the selected article to the savedArticles array.
    async addToSavedArticles(index: number) 
    {
        await this.loadSavedArticlesFromStorage();
        this.savedArticles.push(this.newsStoriesArray[index]);
        await this.saveSavedArticlesToStorage();
        console.log("Added to saved");
    }

    // Displays an Alert asking the user if they wish to add the selected article to the savedArticles array.
    async presentSaveAlert(index: number) 
    {
        const alert = await this.alertCtrl.create({
            header: 'Save Article',
            message: 'Add article to your Saved Articles?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Add',
                    handler: () => {
                        this.addToSavedArticles(index);
                    }
                }
            ]
        });

        await alert.present();
    }

    async saveSavedArticlesToStorage() 
    {
        this.storage.create();
        await this.storage.set('savedArticles', this.savedArticles);
    }

    async loadSavedArticlesFromStorage() 
    {
        this.storage.create();

        // Attempts to load savedArticles from storage, sets it to an empty array if null.
        try 
        {
            this.savedArticles = await this.storage.get('savedArticles');

            if (this.savedArticles === null)
            {
                this.savedArticles = [];
            }
        }
        catch (error) 
        {
            console.log('Error retrieving savedArticles from storage:', error);
            this.savedArticles = [];
        }
    }
}