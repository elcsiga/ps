import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";
import {Apollo, gql} from 'apollo-angular-boost';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(private apollo: Apollo) {
    }

    ngOnInit() {
    }
}
