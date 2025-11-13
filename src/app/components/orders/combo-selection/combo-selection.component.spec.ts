import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-combo-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './combo-selection.component.html',
  styleUrls: ['./combo-selection.component.scss']
})
export class ComboSelectionComponent {

  @Input() combos: any[] = [];   
  @Input() show: boolean = false; 

  @Output() selected = new EventEmitter<any>(); 
  @Output() closed = new EventEmitter<void>();  

  choose(c: any) {
    this.selected.emit(c);
  }

  close() {
    this.closed.emit();
  }
}
