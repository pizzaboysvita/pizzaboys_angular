import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsertMediaComponent } from '../../components/widgets/insert-media/insert-media.component';
import { WarningModelComponent } from '../../components/widgets/warning-model/warning-model.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor(public modal: NgbModal) { }

  insertMedia() {
    this.modal.open(InsertMediaComponent, { windowClass: 'theme-modal', centered: true, size: 'lg' })
  }

  warningModel(data:any) {
  const modalRef =  this.modal.open(WarningModelComponent, {
      windowClass: 'theme-modal remove-coupon',
      centered: true
    })
    modalRef.componentInstance.headerText = data.headertext;
modalRef.componentInstance.bodyText = data.modelbodytext
  }
private dishesSource = new BehaviorSubject<any[]>([]);
  dishes$ = this.dishesSource.asObservable();
private totalDishList = new BehaviorSubject<any[]>([]);
  totalDishList$ = this.totalDishList.asObservable();

  // function to update dishes
  setDishes(dishes: any[]) {
    this.dishesSource.next(dishes);
  }
   setTotalDishList(dishes: any[]) {
    this.totalDishList.next(dishes);
  }
}
