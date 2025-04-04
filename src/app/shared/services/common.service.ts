import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsertMediaComponent } from '../../components/widgets/insert-media/insert-media.component';
import { WarningModelComponent } from '../../components/widgets/warning-model/warning-model.component';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor(public modal: NgbModal) { }

  insertMedia() {
    this.modal.open(InsertMediaComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
  }

  warningModel() {
    this.modal.open(WarningModelComponent, {
      windowClass: 'theme-modal remove-coupon',
      centered: true
    })
  }

}
