import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-info-bar",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./info-bar.component.html",
  styleUrl: "./info-bar.component.scss",
})
export class InfoBarComponent {
  @Input() infoBar: any = {
    type: "warning",
    text: "",
    bold: false,
  };

  @Output() infoBarChange = new EventEmitter<any>();

  onInfoBarChange() {
    this.infoBarChange.emit(this.infoBar);
  }

  getBackgroundColor() {
    return `bg-${this.infoBar.type}`;
  }

  getIconClass() {
    switch (this.infoBar.type) {
      case "info":
        return "bi-info-circle-fill";
      case "success":
        return "bi-check-circle-fill";
      case "danger":
        return "bi-exclamation-triangle-fill";
      case "warning":
      default:
        return "bi-exclamation-circle-fill";
    }
  }
}
