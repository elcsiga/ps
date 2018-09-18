import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ApolloBoost, ApolloBoostModule} from 'apollo-angular-boost';
import {HttpClientModule} from '@angular/common/http';
import {KitButtonModule, KitDataContainerModule} from "kit";
import { ProjectListComponent } from './components/project-list/project-list.component';
import { AppRoutingModule } from './/app-routing.module';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        ProjectListComponent,
        ProjectPageComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ApolloBoostModule,
        KitButtonModule,
        KitDataContainerModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(boost: ApolloBoost) {
        boost.create({
            uri: 'http://localhost:3000/graphql'
        });
    }
}
