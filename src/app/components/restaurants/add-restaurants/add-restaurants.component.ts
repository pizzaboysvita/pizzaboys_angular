import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWorkingHourComponent } from '../widgets/add-working-hour/add-working-hour.component';

@Component({
  selector: 'app-add-restaurants',
  imports: [CardComponent],
  templateUrl: './add-restaurants.component.html',
  styleUrl: './add-restaurants.component.scss'
})
export class AddRestaurantsComponent {
 constructor(public modal: NgbModal){ }

  addHour(){
   this.modal.open(AddWorkingHourComponent,{ windowClass:'theme-modal add-hours',centered:true,size:'lg'})  
  }
}
