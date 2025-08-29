import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddPromocodeComponent } from "../add-promocode/add-promocode.component";

@Component({
  selector: "app-promocodes",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./promocodes.component.html",
  styleUrl: "./promocodes.component.scss",
})
export class PromocodesComponent {
  constructor(private modalService: NgbModal) {}

  openCreatePromoCodeModal() {
    this.modalService.open(AddPromocodeComponent, { size: "lg" });
  }
}
