import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWorkingHourComponent } from '../widgets/add-working-hour/add-working-hour.component';

@Component({
    selector: 'app-hours-of-working',
    imports: [],
    templateUrl: './hours-of-working.component.html',
    styleUrl: './hours-of-working.component.scss'
})

export class HoursOfWorkingComponent {

  constructor(public modal: NgbModal){ }

  addHour(){
   this.modal.open(AddWorkingHourComponent,{ windowClass:'theme-modal add-hours',centered:true,size:'lg'})  
  }

}
