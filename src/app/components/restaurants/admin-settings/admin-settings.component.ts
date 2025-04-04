import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-admin-settings',
    imports: [],
    templateUrl: './admin-settings.component.html',
    styleUrl: './admin-settings.component.scss'
})

export class AdminSettingsComponent {

  constructor(public commonService :CommonService){}

}
