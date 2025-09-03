import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbActiveModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-printer",
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule],
  templateUrl: "./printer.component.html",
  styleUrl: "./printer.component.scss",
})
export class PrinterComponent {
  APIKEY =
    " RESkOJdl7JeR3J5XF4MCxk6p|ap_ZDqIXy|844aa25a-832b-403f-be2f-2510ddae1d7d";
  activeService = 1;

  printer: any = {
    name: "",
    posTerminals: [],
    disablePrinter: false,
    autoPrintOrders: true,
    autoPrintBookings: true,
    posAutoPrintOrders: true,
    posAutoPrintOrderEdits: true,
    posAutoPrintBookings: true,
    autoPrintDeliveryUpdates: true,
    autoPrintOrderServices: null,
    autoPrintFailEmail: null,
  };

  constructor(public activeModal: NgbActiveModal) {}

  savePrinter() {
    console.log("Saving printer:", this.printer);
    this.activeModal.close("saved");
  }
}
