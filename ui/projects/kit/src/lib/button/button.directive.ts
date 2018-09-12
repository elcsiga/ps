import {Directive, HostBinding} from '@angular/core';

@Directive({
    selector: '[kitButton]'
})
export class ButtonDirective {

    @HostBinding('style.background-color') backgroundColor = 'orange';
    @HostBinding('style.color') color = 'white';

    constructor() {
    }

}
