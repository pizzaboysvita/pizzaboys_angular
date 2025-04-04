import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-maintenance',
    imports: [],
    templateUrl: './maintenance.component.html',
    styleUrl: './maintenance.component.scss'
})

export class MaintenanceComponent {

  constructor(public commonService : CommonService){}

}
