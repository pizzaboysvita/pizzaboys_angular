import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DoneModalComponent } from '../done-modal/done-modal.component';

@Component({
    selector: 'app-warning-model',
    imports: [],
    templateUrl: './warning-model.component.html',
    styleUrl: './warning-model.component.scss'
})

export class WarningModelComponent {
  
  constructor(public modal: NgbModal) { }

  doneModal() {
    this.modal.dismissAll();
    this.modal.open(DoneModalComponent, {
      windowClass: 'theme-modal remove-coupon',
      centered: true
    })
  }

}
