import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-pickups",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./pickups.component.html",
  styleUrl: "./pickups.component.scss",
})
export class PickupsComponent {
  isPickupEnabled: boolean = false;
  foodPrepTime: string = "20";
  pickupNotes: string = "";
  defaultMenu: string = "None";


  enableImmediateOrders: boolean = false;
  firstOrderOffset: string = '10';
  lastOrderOffset: string = '5';
  enableLaterOrders: boolean = false;
  maximumDaysAhead: string = '7';
  timeInterval: string = '5';
  orderOffset: string = '20';
  constructor() {}

  ngOnInit(): void {}


}
