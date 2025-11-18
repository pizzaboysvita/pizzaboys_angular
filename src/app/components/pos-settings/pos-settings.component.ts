import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-settings',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './pos-settings.component.html',
  styleUrl: './pos-settings.component.scss'
})
export class PosSettingsComponent {
 constructor(public modal: NgbModal,public router: Router) { }
 Openmodal=false
 
paymentForm = new FormGroup({
  transactionRef: new FormControl(null),
  buttonName: new FormControl(null),
  buttonValue: new FormControl(null),

});
openDebugModal(){
 this.Openmodal=true

}
}
