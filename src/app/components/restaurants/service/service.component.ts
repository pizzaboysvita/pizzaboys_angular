import { Component } from '@angular/core';
import { Services } from '../../../shared/data/restaurant';

@Component({
    selector: 'app-service',
    imports: [],
    templateUrl: './service.component.html',
    styleUrl: './service.component.scss'
})

export class ServiceComponent {

  public Services = Services ;

}
