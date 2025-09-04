import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PrinterComponent } from "../printer/printer.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-reciept-printer",
  standalone: true, 
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./reciept-printer.component.html",
  styleUrl: "./reciept-printer.component.scss",
})
export class RecieptPrinterComponent {
  printers = [
    { name: "Online Ordering - Customer", status: "Connected" },
    { name: "Online Ordering - Kitchen", status: "Disabled" },
    { name: "POS - Customer", status: "Connected" },
    { name: "POS - Kitchen", status: "Connected" },
  ];

  constructor(private modalService: NgbModal) {}

  openCreateModal() {
    this.modalService.open(PrinterComponent, {
      size: "xl",
      backdrop: "static",
    });
  }

  refresh() {
    console.log("Refreshing printer list...");

    this.printers = [...this.printers];
  }

  deletePrinter(printer: any) {
    console.log("Delete printer", printer);

    this.printers = this.printers.filter((p) => p !== printer);
  }
}
