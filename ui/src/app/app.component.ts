import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";
import {Apollo, gql} from 'apollo-angular-boost';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    projects$: Observable<any>;

    constructor(private apollo: Apollo) {
    }

    ngOnInit() {
        this.projects$ = this.apollo
            .watchQuery<any>({
                query: gql`
                    {
                      projects {
                        name
                        participants {
                          role
                          partner {
                            name
                          }
                        }
                      }
                    }
                `,
            }).valueChanges;
    }
}
