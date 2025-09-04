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

  constructor() {}

  ngOnInit(): void {}

  fees = [
    { min: 0, max: 1, cost: 7.99 },
    { min: 1, max: 3, cost: 9.99 },
    { min: 3, max: 6, cost: 12.99 },
  ];

  freeDeliveryAmount: string = "0.00";
  restrictFeeTimes: string = "";


  addFee(): void {
    const lastFee = this.fees[this.fees.length - 1];
    this.fees.push({
      min: lastFee.max,
      max: lastFee.max + 3, 
      cost: 0,
    });
  }

  removeFee(index: number): void {
    if (this.fees.length > 1) {
      this.fees.splice(index, 1);
    }
  }

  onSave(): void {
    const feeSettings = {
      fees: this.fees,
      freeDeliveryAmount: this.freeDeliveryAmount,
      restrictFeeTimes: this.restrictFeeTimes,
    };
    console.log("Delivery fee settings saved:", feeSettings);
  }
}
