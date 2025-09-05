import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-deliveries",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./deliveries.component.html",
  styleUrls: ["./deliveries.component.scss"],
})
export class DeliveriesComponent implements OnInit {
  isDeliveryEnabled: boolean = false;
  foodPrepTime: string = "40";
  deliveryNotes: string = "";
  avoidTolls: boolean = false;
  avoidHighways: boolean = false;
  blockAddresses: string = "";
  defaultMenu: string = "None";

  minOrderAmount: string = "30.00";
  maxDeliveryDistance: string = "6";
  maxDrivingTime: string = "45";

  selectedFile: File | null = null;

  enableImmediateOrders: boolean = true;
  firstOrderOffset: number = 30;
  lastOrderOffset: number = 15;
  enableLaterOrders: boolean = true;
  maxDaysAhead: number = 7;
  timeInterval: number = 15;
  orderOffset: number = 30;
  constructor() {}

  ngOnInit(): void {}

  // Fee tab state
  feeType: string = 'range'; // default
  fixedFee: number = 0;
  feeRanges: { km: number; cost: number }[] = [
    { km: 1, cost: 7.99 },
    { km: 3, cost: 9.99 },
    { km: 6, cost: 12.99 },
  ];
  formula: string = '';

  freeDeliveryAmount: number = 0;
  restrictFeeTime: string = '';

  addRange() {
    this.feeRanges.push({ km: 0, cost: 0 });
  }

  removeRange(index: number) {
    this.feeRanges.splice(index, 1);
  }

  saveFees() {
    const feesConfig = {
      feeType: this.feeType,
      fixedFee: this.fixedFee,
      feeRanges: this.feeRanges,
      formula: this.formula,
      freeDeliveryAmount: this.freeDeliveryAmount,
      restrictFeeTime: this.restrictFeeTime,
    };
    console.log('Delivery Fees Saved:', feesConfig);
    // TODO: send feesConfig to backend
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log("Selected KML file:", this.selectedFile.name);
    }
  }

  saveZones() {
    if (!this.selectedFile) {
      alert("Please upload a KML file before saving.");
      return;
    }
    // TODO: send this.selectedFile to backend
    console.log("Saving zones with file:", this.selectedFile);
  }

  saveOrderTiming() {
    const timingSettings = {
      enableImmediateOrders: this.enableImmediateOrders,
      firstOrderOffset: this.firstOrderOffset,
      lastOrderOffset: this.lastOrderOffset,
      enableLaterOrders: this.enableLaterOrders,
      maxDaysAhead: this.maxDaysAhead,
      timeInterval: this.timeInterval,
      orderOffset: this.orderOffset,
    };
    console.log("Order Timing Settings Saved:", timingSettings);
    // TODO: send timingSettings to backend API
  }
}
