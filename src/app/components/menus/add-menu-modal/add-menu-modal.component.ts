import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-menu-modal',
  standalone: true,
  imports: [NgbNavModule, NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-menu-modal.component.html',
  styleUrls: ['./add-menu-modal.component.scss']
})
export class AddMenuModalComponent {

  active = 1;
  menuForm: FormGroup;
  conditionForm: FormGroup;

  availabilityOptions = [
    { id: 1, name: 'Breakfast' },
    { id: 2, name: 'Lunch' },
    { id: 3, name: 'Dinner' },
  ];

  surchargeFields = [
    {
      label: 'Pickup Surcharge',
      controlName: 'pickupSurcharge',
      subtext: 'Additional % to apply to item prices for pickup sales'
    },
    {
      label: 'Delivery Surcharge',
      controlName: 'deliverySurcharge',
      subtext: 'Additional % to apply to item prices for delivery sales'
    },
    {
      label: 'Managed Delivery Surcharge',
      controlName: 'managedDeliverySurcharge',
      subtext: 'Additional % to apply to item prices for managed delivery sales where we supply drivers'
    },
    {
      label: 'Dine-In Surcharge',
      controlName: 'dineInSurcharge',
      subtext: 'Additional % to apply to item prices for dine-in sales'
    }
  ];

  orderTimesOptions = [
    { id: 1, name: 'Breakfast' },
    { id: 2, name: 'Lunch' },
    { id: 3, name: 'Dinner' },
    { id: 4, name: 'Late Night' }
  ];

  servicesOptions = [
    { id: 1, name: 'Delivery' },
    { id: 2, name: 'Pickup' },
    { id: 3, name: 'Dine-in' }
  ];

  preOrderServicesOptions = [
    { id: 1, name: 'Delivery' },
    { id: 2, name: 'Pickup' }
  ];

  constructor(private fb: FormBuilder, public modal: NgbModal) {
    this.menuForm = this.fb.group({
      name: [''],
      displayName: [''],
      description: [''],
      disableDishNotes: [false],
      restockMenuDaily: [false],
      hideMenu: [false],
      availability: [[]],
      posName: [''],
      surcharge: [''],
    });

    this.conditionForm = this.fb.group({
      orderTimes: [[]],
      services: [[]],
      preOrderServices: [[]],
      ageRestricted: [false],
      preOrderOnly: [false],
      preOrderDays: [0],
      preOrderCutoffTime: ['00:00'],
      hideRestrictionWarning: [false],
      hideIfUnavailable: [false]
    });
  }

  saveMenu() {
    console.log('Saving menu', this.menuForm.value);
  }
  addTimeSlot() {
    console.log('Add Time Slot clicked');
    alert('Add Time Slot clicked (you can open a modal or dialog here)');
  }
}