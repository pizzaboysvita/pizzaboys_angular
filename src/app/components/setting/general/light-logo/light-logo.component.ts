import { Component } from '@angular/core';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
    selector: 'app-light-logo',
    imports: [],
    templateUrl: './light-logo.component.html',
    styleUrl: './light-logo.component.scss'
})

export class LightLogoComponent {

  constructor(public commonService : CommonService){}

}
