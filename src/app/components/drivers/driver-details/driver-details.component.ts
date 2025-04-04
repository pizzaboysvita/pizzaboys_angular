import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-driver-details',
    imports: [],
    templateUrl: './driver-details.component.html',
    styleUrl: './driver-details.component.scss'
})

export class DriverDetailsComponent {

  constructor(public commonService: CommonService){ }

}
