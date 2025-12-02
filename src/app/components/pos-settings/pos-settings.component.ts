import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-settings',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './pos-settings.component.html',
  styleUrl: './pos-settings.component.scss'
})
export class PosSettingsComponent {
 constructor(public modal: NgbModal,public router: Router,private fb: FormBuilder) { 
  this.layoutForm = this.fb.group({
      navbarWidth: [320, [Validators.required]],
      cartWidth: [320, [Validators.required]],
      itemSize: [16, [Validators.required]],
      itemFontSize: [14, [Validators.required]]
    });
 }
 Openmodal=false;
 OpenLayoutModal=false;
 securityModal=false;
 layoutForm!: FormGroup;
 securityOptions = [
  { label: 'Close POS', enabled: false },
  { label: 'Discounts', enabled: false },
  { label: 'Refunds', enabled: false },
  { label: 'Cash Draw', enabled: false },
  { label: 'Float Adjustment', enabled: false },
  { label: 'Takings / Cash Up', enabled: false },

  {
    label: 'Order Dish Delete',
    subText: 'Prevent deleting dishes after they have printed',
    enabled: false
  },

  { label: 'Order Delete Permanently', enabled: false }
];
 paymentForm = new FormGroup({
  transactionRef: new FormControl(null),
  buttonName: new FormControl(null),
  buttonValue: new FormControl(null),
  });
 
openDebugModal(){
 this.Openmodal=true

}
openLayoutModal(){
 this.OpenLayoutModal=true

}
openSecurityModal(){
 this.securityModal=true;

}
}
