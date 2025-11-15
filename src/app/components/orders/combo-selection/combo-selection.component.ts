import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-combo-selection',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './combo-selection.component.html',
  styleUrl: './combo-selection.component.scss'
})
export class ComboSelectionComponent {


  
@Input() combos: any[] = [];
  @Input() show = false;

  @Output() selected = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  choose(combo: any) {
    this.selected.emit(combo);
  }

  close() {
    this.closed.emit();
  }
}
