import { Component, OnInit } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

interface TimeSlot {
  day: string;
  openTime: string;
  closeTime: string;
  is24Hour: boolean;
}

interface SpecialTimeSlot {
  day: string;
  openTime: string;
  closeTime: string;
  is24Hour: boolean;
}

@Component({
  selector: "app-opening-hours",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgbModule,
  ],
  templateUrl: "./opening-hours.component.html",
  styleUrls: ["./opening-hours.component.scss"],
})
export class OpeningHoursComponent implements OnInit {
  activeService = 1;

  // Data arrays for General hours
  regularHours: TimeSlot[] = [];
  specialHours: SpecialTimeSlot[] = [];

  // Data arrays for Pickup hours
  pickupHours: TimeSlot[] = [];
  pickupSpecialHours: SpecialTimeSlot[] = [];

  // Data arrays for Delivery hours
  deliveryHours: TimeSlot[] = [];
  deliverySpecialHours: SpecialTimeSlot[] = [];

  // Data arrays for Dine In hours
  dineInHours: TimeSlot[] = [];
  dineInSpecialHours: SpecialTimeSlot[] = [];

  // Data arrays for Table Bookings hours
  tableBookingsHours: TimeSlot[] = [];
  tableBookingsSpecialHours: SpecialTimeSlot[] = [];

  daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  timeOptions: string[] = [];

  constructor() {
    this.timeOptions = this.generateTimeOptions();
  }

  ngOnInit(): void {
    // Component starts with empty time slot lists.
  }

  // --- Helper Methods ---
  private generateTimeOptions(): string[] {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  }

  toggle24Hour(slot: TimeSlot | SpecialTimeSlot) {
    if (slot.is24Hour) {
      slot.openTime = "00:00";
      slot.closeTime = "23:59";
    } else {
      slot.openTime = "09:00";
      slot.closeTime = "17:00";
    }
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.regularHours, event.previousIndex, event.currentIndex);
  }

  save() {
    console.log("General Hours:", this.regularHours, this.specialHours);
    console.log("Pickup Hours:", this.pickupHours, this.pickupSpecialHours);
    console.log(
      "Delivery Hours:",
      this.deliveryHours,
      this.deliverySpecialHours
    );
    console.log("Dine In Hours:", this.dineInHours, this.dineInSpecialHours);
    console.log(
      "Table Bookings Hours:",
      this.tableBookingsHours,
      this.tableBookingsSpecialHours
    );
    alert("Hours saved!");
  }

  // --- General Hours Methods ---
  addTimeSlot() {
    this.regularHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteTimeSlot(index: number) {
    this.regularHours.splice(index, 1);
  }

  copyTimeSlot(index: number) {
    const slotToCopy = { ...this.regularHours[index] };
    this.regularHours.splice(index + 1, 0, slotToCopy);
  }

  addSpecialHoursSlot() {
    this.specialHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteSpecialTimeSlot(index: number) {
    this.specialHours.splice(index, 1);
  }

  // --- Pickup Hours Methods ---
  addPickupTimeSlot() {
    this.pickupHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deletePickupTimeSlot(index: number) {
    this.pickupHours.splice(index, 1);
  }

  addPickupSpecialHoursSlot() {
    this.pickupSpecialHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deletePickupSpecialTimeSlot(index: number) {
    this.pickupSpecialHours.splice(index, 1);
  }

  // --- Delivery Hours Methods ---
  addDeliveryTimeSlot() {
    this.deliveryHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteDeliveryTimeSlot(index: number) {
    this.deliveryHours.splice(index, 1);
  }

  addDeliverySpecialHoursSlot() {
    this.deliverySpecialHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteDeliverySpecialTimeSlot(index: number) {
    this.deliverySpecialHours.splice(index, 1);
  }

  // --- Dine In Hours Methods ---
  addDineInTimeSlot() {
    this.dineInHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteDineInTimeSlot(index: number) {
    this.dineInHours.splice(index, 1);
  }

  addDineInSpecialHoursSlot() {
    this.dineInSpecialHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteDineInSpecialTimeSlot(index: number) {
    this.dineInSpecialHours.splice(index, 1);
  }

  // --- Table Bookings Hours Methods ---
  addTableBookingsTimeSlot() {
    this.tableBookingsHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteTableBookingsTimeSlot(index: number) {
    this.tableBookingsHours.splice(index, 1);
  }

  addTableBookingsSpecialHoursSlot() {
    this.tableBookingsSpecialHours.push({
      day: this.daysOfWeek[0],
      openTime: "09:00",
      closeTime: "17:00",
      is24Hour: false,
    });
  }

  deleteTableBookingsSpecialTimeSlot(index: number) {
    this.tableBookingsSpecialHours.splice(index, 1);
  }
}
