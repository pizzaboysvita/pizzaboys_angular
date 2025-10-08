import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SettingsService } from "../../settings.service";

@Component({
  selector: "app-pickups",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./pickups.component.html",
  styleUrls: ["./pickups.component.scss"],
})
export class PickupsComponent implements OnInit {
  pickupForm!: FormGroup;
  isSubmitting = false;

  daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.pickupForm = this.fb.group({
      enabled: [false],
      food_prep_time: [null, [Validators.min(1)]],
      food_prep_periods: this.fb.array([]),
      pickup_notes: [""],
      default_menu: [""],

      enable_immediate_orders: [false],
      first_order_offset: [null, [Validators.min(0)]],
      last_order_offset: [null, [Validators.min(0)]],
      enable_later_orders: [false],
      max_days_ahead: [null, [Validators.min(1)]],
      time_interval: [null, [Validators.min(1)]],
      order_offset: [null, [Validators.min(1)]],
    });

    this.addPrepSlot();
  }

  get foodPrepPeriods(): FormArray {
    return this.pickupForm.get("food_prep_periods") as FormArray;
  }

  private createPrepSlot(data?: any): FormGroup {
    return this.fb.group({
      day: [data?.day ?? "Monday", Validators.required],
      from: [data?.from ?? "09:00", Validators.required],
      to: [data?.to ?? "21:00", Validators.required],
      is_24_hour: [data?.is_24_hour ?? false],
      prep_time: [data?.prep_time ?? null, Validators.required],
    });
  }

  addPrepSlot(data?: any) {
    this.foodPrepPeriods.push(this.createPrepSlot(data));
  }

  duplicatePrepSlot(index: number) {
    const source = this.foodPrepPeriods.at(index).value;
    this.addPrepSlot({ ...source });
  }

  removePrepSlot(index: number) {
    this.foodPrepPeriods.removeAt(index);
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.pickupForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  slotHasError(slotIndex: number, controlName: string, error: string): boolean {
    const slot = this.foodPrepPeriods.at(slotIndex) as FormGroup;
    const control = slot.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  savePickupService(): void {
    this.pickupForm.markAllAsTouched();

    if (this.pickupForm.invalid) {
      alert("Please fix validation errors before saving.");
      return;
    }

    this.isSubmitting = true;

    const payload = {
      type: "insert",
      store_id: 10,
      ...this.pickupForm.value,
      created_by: 101,
    };

    this.settingsService.savePickupService(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        console.log("Pickup service saved:", res);
        alert("Pickup service saved successfully.");
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error("Error saving pickup service:", err);
        alert("Failed to save pickup service.");
      },
    });
  }
}
