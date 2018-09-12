import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";

@Component({
    selector: 'kit-data-container',
    templateUrl: './data-container.component.html',
    styleUrls: ['./data-container.component.css']
})
export class DataContainerComponent implements OnInit {

    @Input() input: Observable<any>;
    @Input() dataTemplate: ElementRef;

    constructor() {
    }

    ngOnInit() {
    }

}
