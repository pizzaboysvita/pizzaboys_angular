import { Component } from '@angular/core';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
    selector: 'app-dark-logo',
    imports: [],
    templateUrl: './dark-logo.component.html',
    styleUrl: './dark-logo.component.scss'
})

export class DarkLogoComponent {

  constructor(public commonService : CommonService){}

}
