import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateFeeComponent } from "../create-fee/create-fee.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-conditional-fee",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./conditional-fee.component.html",
  styleUrl: "./conditional-fee.component.scss",
})
export class ConditionalFeeComponent {
  constructor(private modalService: NgbModal) {}

  openCreatFeeModal() {
    this.modalService.open(CreateFeeComponent, { size: "lg" });
  }
}
