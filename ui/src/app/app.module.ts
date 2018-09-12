import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ApolloBoost, ApolloBoostModule} from 'apollo-angular-boost';
import {HttpClientModule} from '@angular/common/http';
import {KitButtonModule, KitDataContainerModule} from "kit";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ApolloBoostModule,
        KitButtonModule,
        KitDataContainerModule
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
