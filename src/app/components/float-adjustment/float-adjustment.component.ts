import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-float-adjustment',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './float-adjustment.component.html',
  styleUrl: './float-adjustment.component.scss'
})
export class FloatAdjustmentComponent {
   constructor(public modal: NgbModal,public router: Router) { }
activeTab = 'create';

sourceOptions: string[] = ['Float Cash', 'Petty Cash', 'Clearing Cash'];
destinationOptions: string[] = [];

paymentForm = new FormGroup({
  amount: new FormControl(null),
  source: new FormControl(null),
  destination: new FormControl(null),
  notes: new FormControl('')
});

updateDestinationOptions() {
  const src = this.paymentForm.get('source')?.value;

  const all = ['Float Cash', 'Petty Cash', 'Clearing Cash'];

  // If no source selected, show empty list
  if (!src) {
    this.destinationOptions = [];
    return;
  }

  // Now src is definitely a string
  this.destinationOptions = all.filter(x => x !== src);
}


}
