import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ApolloBoost, ApolloBoostModule} from 'apollo-angular-boost';
import {HttpClientModule} from '@angular/common/http';
import {DemoComponent} from './components/demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloBoostModule
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
