import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from 'apollo-angular-boost';

interface DemoData {
    test: any;
}

@Component({
    selector: 'app-demo',
    template: `
        <div *ngIf="loading">
            <h3>Loading</h3>
        </div>
        <div *ngIf="error">
            <h3>Error</h3> {{ error | json }}
        </div>
        <div *ngIf="data">
            <h3>Success</h3> {{ data | json }}
        </div>
    `,
})
export class DemoComponent implements OnInit {
    data: DemoData;
    loading: boolean;
    error: any;

    constructor(private apollo: Apollo) {
    }

    ngOnInit() {
        this.apollo
            .watchQuery<DemoData>({
                query: gql`
                {
                    blogposts(limit: 10) {
                      title
                      thumbnail
                      content
                    }
                }
                `,
            })
            .valueChanges.subscribe(result => {
                this.data = result.data;
                this.loading = result.loading;
                this.error = result.errors ? { graphQLErrors: result.errors } : null;
            }, error => {
                this.error = error;
            }
        );
    }
}
