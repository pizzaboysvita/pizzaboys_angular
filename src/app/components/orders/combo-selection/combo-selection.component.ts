import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-combo-selection",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./combo-selection.component.html",
  styleUrl: "./combo-selection.component.scss",
})
export class ComboSelectionComponent {
  @Input() combos: any[] = [];
  @Output() selected = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  getDishNames(combo: any): string {
    if (!combo.items || combo.items.length === 0) {
      return "";
    }

    return combo.items
      .map((item: any) => item.dish_name || "ID:" + item.dish_id)
      .join(" + ");
  }

  select(combo: any) {
    console.log("SELECT CLICKED → Combo:", combo);
    this.selected.emit(combo);
  }

  close() {
    this.closed.emit();
  }
}
