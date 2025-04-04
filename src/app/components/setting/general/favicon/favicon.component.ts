import { Component } from '@angular/core';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
    selector: 'app-favicon',
    imports: [],
    templateUrl: './favicon.component.html',
    styleUrl: './favicon.component.scss'
})

export class FaviconComponent {

  constructor(public commonService : CommonService){}

}
