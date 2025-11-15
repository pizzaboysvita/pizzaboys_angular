import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-combo-alert',
  standalone: true,
  imports: [],
  templateUrl: './combo-alert.component.html',
  styleUrl: './combo-alert.component.scss'
})
export class ComboAlertComponent {
 @Input() message: string = '';  
  @Input() title: string = 'Combo Available';
  @Output() yes = new EventEmitter<void>();
  @Output() no = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onYes() { this.yes.emit(); }
  onNo() { this.no.emit(); }
  onClose() { this.closed.emit(); }
}
