import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddWorkingHourComponent } from '../widgets/add-working-hour/add-working-hour.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-restaurants',
  imports: [CardComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './add-restaurants.component.html',
  styleUrl: './add-restaurants.component.scss'
})
export class AddRestaurantsComponent {
 constructor(public modal: NgbModal,private fb: FormBuilder){ }
  storeForm!: FormGroup;

  addHour(){
   this.modal.open(AddWorkingHourComponent,{ windowClass:'theme-modal add-hours',centered:true,size:'lg'})  
  }

    ngOnInit() {
    this.storeForm = this.fb.group({
      storeName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      status: ['Active', Validators.required],
    });
  }
addStore() {
    if (this.storeForm.valid) {
      console.log(this.storeForm.value);
    } else {
      this.storeForm.markAllAsTouched();
    }
  }

}
