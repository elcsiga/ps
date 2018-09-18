import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular-boost';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.scss'],

    animations: [
        trigger('flyInOut', [

            transition('void => *', [
                style({
                    transform: 'scale(.5,.5)',
                    opacity: 0
                }),
                animate(300)
            ]),
            transition('* => void', [
                animate(300, style({
                    transform: 'scale(.5,.5)',
                    opacity: 0
                }))
            ])
        ])
    ]
})
export class ProjectPageComponent implements OnInit {

    projects$: Observable<any>;

    constructor(
        private apollo: Apollo,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        const projectsQuery = gql`
            {
                projects {
                    id
                    name
                }
            }`;
        const projectQuery = gql`
            query PROJECT($id: ID!) {
                project (id: $id) {
                    id
                    name
                }
            }`;
        this.projects$ = this.route.params
            .pipe(switchMap(params =>
                this.apollo.watchQuery<any>(params.projectId ? {
                    query: projectQuery,
                    variables: { id : params.projectId }
                } : {
                    query: projectsQuery
                }).valueChanges
            ));
    }

    getUnifiedProjectList(data) {
        return data.projects ? data.projects : [data.project];
    }

    trackById(index: number, project) {
        return project.id;
    }
}


