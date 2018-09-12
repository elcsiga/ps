import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataContainerComponent } from './data-container.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DataContainerComponent
    ],
    exports: [
        DataContainerComponent
    ]
})
export class KitDataContainerModule {
}
