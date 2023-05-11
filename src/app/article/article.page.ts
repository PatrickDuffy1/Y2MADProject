import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-article',
    templateUrl: './article.page.html',
    styleUrls: ['./article.page.scss'],
})
export class ArticlePage 
{
    currentArticle: any = [];   // Stores the information about the article that will be displayed on this page.
    articleContent: string = "Sorry there was an error";

    constructor(private storage: Storage, private navCtrl: NavController) { }

    async ionViewWillEnter() 
    {
        await this.loadCurrentArticle();

        // Goes to home page if there is no article informaton.
        if (this.currentArticle.length == 0) 
        {
            this.navCtrl.navigateBack('/home');
        }
    }

    async loadCurrentArticle() 
    {
        this.storage.create();
        this.currentArticle = await this.storage.get('currentArticle');
    }

    // Calls openBrowser and passes the link of the original article.
    goToArticle() 
    {
        this.openBrowser(this.currentArticle.link);
    }

    // Opens browser and goes to the original article.
    async openBrowser(site: string) 
    {
        await Browser.open({ url: site });
    };
}
