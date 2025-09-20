import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbActiveModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { QuillModule } from 'ngx-quill';

@Component({
  selector: "app-printer",
  standalone: true,
  imports: [CommonModule, FormsModule, NgbNavModule, DragDropModule, QuillModule],
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
    printingMethod: "ESC/POS",
    paperWidth: 280,
    paperHeight: 1,
    paperScaleFactor: 2,
    paperDensity: "D24",
    fontSize: 16,
    numberOfBeeps: 0,
    beepMethod: "internal",
    paperCutType: "full",
    charactersPerLine: 48,
    header: '',
    footer: '',
    layout: ["Details", "Dishes", "Totals"],

    detailCustomization: [
      { key: "deliveryDistance", label: "Delivery Distance (km)", enabled: true },
      { key: "deliveryTime", label: "Delivery Driving Time (minutes)", enabled: true },
      { key: "bookingStatus", label: "Tookan Delivery Booking Status", enabled: true },
      { key: "customerName", label: "Customer Name", enabled: true },
      { key: "customerEmail", label: "Customer Email", enabled: true },
      { key: "customerPhone", label: "Customer Phone", enabled: true }
    ],

    dishCustomization: [
      { key: "showDishes", label: "Show Dishes", enabled: true },
      { key: "showDishPrices", label: "Show Dish Prices", enabled: true },
      { key: "showDishOptionSetPrices", label: "Show Dish Option-set Prices", enabled: true },
      { key: "showComboDishChoiceHeadings", label: "Show Combo Dish Choice Headings", enabled: true },
      { key: "disableDishPrintingName", label: "Disable Dish Printing Name", enabled: false },
      { key: "disableDishBorder", label: "Disable Dish Border", enabled: false }
    ],

    dishTagSortPriority: "",
    showOrderTotals: true
  };


  constructor(public activeModal: NgbActiveModal) { }
  dishTagOptions = ["By Seat", "By Dish Type", "By Course"];

  resetDetailCustomization() {
    this.printer.detailCustomization.forEach((d: { enabled: boolean; }) => d.enabled = true);
  }


  dropLayout(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.printer.layout, event.previousIndex, event.currentIndex);
  }

  dropDetail(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.printer.detailCustomization, event.previousIndex, event.currentIndex);
  }
  savePrinter() {
    console.log("Saving printer:", this.printer);
    this.activeModal.close("saved");
  }
  clearHeader() {
    this.printer.header = '';
  }

  clearFooter() {
    this.printer.footer = '';
  }


}
