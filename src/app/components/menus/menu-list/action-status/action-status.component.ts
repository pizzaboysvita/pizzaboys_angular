import { Component, Input } from '@angular/core';
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
web: string = '';
@Input() data: any;  
  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.data) {
      this.status = this.data.status || '';
      this.pos = this.data.pos || '';
      this.web = this.data.is_online_hide || '';
    }
  }

  saveStatus() {
    const result = {
      status: this.status,
      pos: this.pos,
      web: this.web
    };
    this.modal.close(result);
  }
  
  close() {
    this.modal.dismiss();
  }
  
  }

