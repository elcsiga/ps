import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { ProjectPageComponent } from './pages/project-page/project-page.component';


const routes: Routes = [
    {
        path: 'projects',
        component: ProjectPageComponent
    },
    {
        path: 'project/:projectId',
        component: ProjectPageComponent
    }
];

export class CustomReuseStrategy implements RouteReuseStrategy {

    private handlers: {[key: string]: DetachedRouteHandle} = {};
    constructor() {
    }
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false; //true;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        //this.handlers[route.routeConfig.path] = handle;
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false; //!!route.routeConfig && !!this.handlers[route.routeConfig.path];
    }
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        return null;
        //if (!route.routeConfig) return null;
        //return this.handlers[route.routeConfig.path];
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        try{
            const a = future.pathFromRoot[0].firstChild.routeConfig.component.name;
            const b = curr.pathFromRoot[0].firstChild.routeConfig.component.name;
            return a === b;
        } catch (e) {
            return false;
        }
    }
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
    ],
    declarations: []
})
export class AppRoutingModule {
}
