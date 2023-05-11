import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-saved',
    templateUrl: './saved.page.html',
    styleUrls: ['./saved.page.scss'],
})
export class SavedPage 
{
    savedArticles: any[] = [];  // Stores the array of articles that the user has saved.
    noArticlesMessage: string = "There are no saved articles";
    noArticlesMessageHidden: boolean = false;

    constructor(private storage: Storage, private navCtrl: NavController, private alertCtrl: AlertController) { }

    async ionViewWillEnter() 
    {
        this.noArticlesMessageHidden = true;

        await this.loadSavedArticlesFromStorage();

        // Checks if variable is null and gives it a valid value if true. 
        if (this.savedArticles == null) 
        {
            this.noArticlesMessageHidden = false;
        }

        // Checks if variable is null and gives it a valid value if true. 
        if (this.savedArticles.length == 0) 
        {
            this.noArticlesMessageHidden = false;
        }
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

    // Save the selected article to storage and goes to the article page, which is where the selected article will be displayed.
    goToArticle(index: number) 
    {
        let temp = this.savedArticles[index];
        this.saveCurrentArticle(temp);
        this.navCtrl.navigateForward('/article');
    }

    async saveCurrentArticle(temp: any) 
    {
        this.storage.create();
        await this.storage.set('currentArticle', temp);
    }

    // Removes an article that the user selected from savedArticles.
    removeFromSavedArticles(index: number) 
    {
        this.savedArticles.splice(index, 1);
        this.saveSavedArticlesToStorage();
        this.navCtrl.navigateForward('/saved');
    }

    // Displays an Alert asking the user if they wish to delete the selected article from the savedArticles array.
    async presentDeleteAlert(index: number) 
    {
        const alert = await this.alertCtrl.create({
            header: 'Remove Article?',
            message: 'Are you sure you want to delete this article from your Saved Articles?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Remove',
                    handler: () => {
                        this.removeFromSavedArticles(index);
                    }
                }
            ]
        });
        await alert.present();
    }

    // Deletes all articles from savedArticles by setting it to an empty array. Save the updated array to storage.
    deleteAllSavedArticles() 
    {
        this.savedArticles = [];
        this.saveSavedArticlesToStorage();
        this.noArticlesMessageHidden = false;
    }

    // Displays an Alert asking the user if they wish to delete all of the articles in the savedArticles array.
    async presentDeleteAllAlert() 
    {
        const alert = await this.alertCtrl.create({
            header: 'WARNING: Remove All Articles?',
            message: 'Are you sure you want to delete all Saved Articles?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Delete All',
                    handler: () => {
                        this.deleteAllSavedArticles();
                    }
                }
            ]
        });
        await alert.present();
    }
}
