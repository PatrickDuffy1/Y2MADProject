import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { NewsService } from '../Services/news.service';
import { ArticlePage } from '../article/article.page';


import { HomePageRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HttpClientModule
  ],
  declarations: [HomePage],

  providers: [
    ArticlePage,
  ]
  
})
export class HomePageModule {}
