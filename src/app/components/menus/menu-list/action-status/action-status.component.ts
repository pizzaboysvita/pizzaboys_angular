import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-action-status',
  imports: [FormsModule],
  templateUrl: './action-status.component.html',
  styleUrl: './action-status.component.scss'
})
export class ActionStatusComponent {
  status: string = '';
pos: string = '';
misc: string = '';

  constructor(public modal: NgbActiveModal) {}

  saveStatus() {
    const result = {
      status: this.status,
      pos: this.pos,
      misc: this.misc
    };
    this.modal.close(result);
  }
  
  close() {
    this.modal.dismiss();
  }
  
  }

