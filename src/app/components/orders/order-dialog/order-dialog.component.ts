import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"; 

@Component({
  selector: "app-order-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./order-dialog.component.html",
  styleUrl: "./order-dialog.component.scss",
})
export class OrderDialogComponent {
  @Input() data: any;

  activeTab = "details";
  statusExpanded = false;
  readyTimeExpanded = false;
  actionsExpanded = false;

  constructor(public activeModal: NgbActiveModal) {} 
  selectTab(tabName: string): void {
    this.activeTab = tabName;
  }

  toggleStatus(): void {
    this.statusExpanded = !this.statusExpanded;
  }

  toggleReadyTime(): void {
    this.readyTimeExpanded = !this.readyTimeExpanded;
  }

  toggleActions(): void {
    this.actionsExpanded = !this.actionsExpanded;
  }
}
