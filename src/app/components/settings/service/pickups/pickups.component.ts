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

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.pickupForm = this.fb.group({
      // General Tab
      enabled: [false],
      food_prep_time: [null, [Validators.min(1)]], // default prep time (overridden by periods)
      food_prep_periods: this.fb.array([]), // <-- FormArray for the slots
      pickup_notes: [""],
      default_menu: [""],

      // Order Timing Tab
      enable_immediate_orders: [false],
      first_order_offset: [null, [Validators.min(0)]],
      last_order_offset: [null, [Validators.min(0)]],
      enable_later_orders: [false],
      max_days_ahead: [null, [Validators.min(1)]],
      time_interval: [null, [Validators.min(1)]],
      order_offset: [null, [Validators.min(1)]],
    });

    // Add one blank prep slot to show the UI by default (optional)
    this.addPrepSlot();
  }

  // Getter for the FormArray
  get foodPrepPeriods(): FormArray {
    return this.pickupForm.get("food_prep_periods") as FormArray;
  }

  // Create a FormGroup for a single slot (optionally prefilled with data)
  private createPrepSlot(data?: any): FormGroup {
    return this.fb.group({
      day: [data?.day ?? "Monday", Validators.required],
      from: [data?.from ?? "09:00", Validators.required], // time string HH:MM
      to: [data?.to ?? "21:00", Validators.required],     // time string HH:MM
      is_24_hour: [data?.is_24_hour ?? false],
      prep_time: [data?.prep_time ?? null, Validators.required], // minutes
    });
  }

  // Add an empty or prefilled slot
  addPrepSlot(data?: any) {
    this.foodPrepPeriods.push(this.createPrepSlot(data));
  }

  // Duplicate slot at index
  duplicatePrepSlot(index: number) {
    const source = this.foodPrepPeriods.at(index).value;
    this.addPrepSlot({ ...source });
  }

  // Remove slot at index
  removePrepSlot(index: number) {
    this.foodPrepPeriods.removeAt(index);
  }

  // Helper to check top-level control errors
  hasError(controlName: string, error: string): boolean {
    const control = this.pickupForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  // Helper to check slot control errors
  slotHasError(slotIndex: number, controlName: string, error: string): boolean {
    const slot = this.foodPrepPeriods.at(slotIndex) as FormGroup;
    const control = slot.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  // Save handler — builds payload and posts to service
  savePickupService(): void {
    // mark touched so validation messages appear
    this.pickupForm.markAllAsTouched();

    if (this.pickupForm.invalid) {
      alert("Please fix validation errors before saving.");
      return;
    }

    this.isSubmitting = true;

    // Use the form value directly — it includes food_prep_periods array
    const payload = {
      type: "insert", // change to "update" when editing an existing pickup config
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
