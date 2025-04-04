import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpecialOfferWorkingHourComponent } from '../widgets/special-offer-working-hour/special-offer-working-hour.component';

@Component({
    selector: 'app-special-offer',
    imports: [],
    templateUrl: './special-offer.component.html',
    styleUrl: './special-offer.component.scss'
})

export class SpecialOfferComponent {

  constructor(public modal: NgbModal){ }

  addHour(){
   this.modal.open(SpecialOfferWorkingHourComponent,{ windowClass:'theme-modal add-hours',centered:true,size:'lg'})  
  }

}
