import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-car-details',
    imports: [],
    templateUrl: './car-details.component.html',
    styleUrl: './car-details.component.scss'
})

export class CarDetailsComponent {

constructor(public commonService :CommonService){}

}
