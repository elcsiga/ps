import {NgModule} from '@angular/core';
import {KitButtonModule} from "./button/button.module";
import {KitDataContainerModule} from "./data-container/data-container.module";

@NgModule({
    imports: [
        KitButtonModule,
        KitDataContainerModule
    ],
    exports: [
        KitButtonModule,
        KitDataContainerModule
    ],
    declarations: []
})
export class KitModule {
}
