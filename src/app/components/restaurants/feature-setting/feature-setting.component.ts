import { Component } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
    selector: 'app-feature-setting',
    imports: [],
    templateUrl: './feature-setting.component.html',
    styleUrl: './feature-setting.component.scss'
})

export class FeatureSettingComponent {

  constructor(public commonService :CommonService){}

}
