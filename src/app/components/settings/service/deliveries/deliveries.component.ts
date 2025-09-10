import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SettingsService } from "../../settings.service";

@Component({
  selector: "app-deliveries",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./deliveries.component.html",
  styleUrls: ["./deliveries.component.scss"],
})
export class DeliveriesComponent implements OnInit {
  deliveryForm!: FormGroup;
  deliveryServiceId: number | null = null; // for update

  constructor(
    private fb: FormBuilder,
    private deliveryService: SettingsService
  ) {}

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      type: ["insert"], 
      delivery_service_id: [null],
      store_id: [null], 
      enabled: [false],
      food_prep_time: [null],
      delivery_notes: [""],
      avoid_tolls: [false],
      avoid_highways: [false],
      block_addresses: [""],
      default_menu: [""],
      min_order_amount: [null],
      max_delivery_distance: [null],
      max_driving_time: [null],
      fee_type: [""],
      fixed_fee: [null],
      range_fee: this.fb.array([]),
      formula_fee: this.fb.group({
        base: [null],
        per_km: [null],
      }),
      free_delivery_amount: [null],
      restrict_fee_times: [""],
      delivery_zone_file: [""],
      enable_immediate_orders: [false],
      first_order_offset: [null],
      last_order_offset: [null],
      enable_later_orders: [false],
      max_days_ahead: [null],
      time_interval: [null],
      order_offset: [null],
      created_by: [null],
    });

    // default 3 ranges
    this.addRange(1, 7.99);
    this.addRange(3, 9.99);
    this.addRange(6, 12.99);
  }

  // ===== Range Fee helpers =====
  get rangeFeeArray(): FormArray {
    return this.deliveryForm.get("range_fee") as FormArray;
  }

  addRange(km = 0, cost = 0) {
    this.rangeFeeArray.push(
      this.fb.group({
        min: [0],
        max: [km],
        fee: [cost],
      })
    );
  }

  removeRange(i: number) {
    this.rangeFeeArray.removeAt(i);
  }

  // ===== File Upload (zones) =====
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.deliveryForm.patchValue({ delivery_zone_file: input.files[0].name });
    }
  }

  // ===== Save =====
  private boolToNum(v: any): number {
    return v ? 1 : 0;
  }

  saveDeliveryService(isUpdate = false) {
    if (this.deliveryForm.invalid) {
      alert("Please fill required fields.");
      return;
    }

    const f = this.deliveryForm.value;

    const payload: any = {
      type: isUpdate ? "update" : "insert",
      store_id: Number(f.store_id),

      enabled: this.boolToNum(f.enabled),
      avoid_tolls: this.boolToNum(f.avoid_tolls),
      avoid_highways: this.boolToNum(f.avoid_highways),

      food_prep_time: Number(f.food_prep_time),
      delivery_notes: f.delivery_notes,
      block_addresses: f.block_addresses,
      default_menu: f.default_menu,

      min_order_amount: Number(f.min_order_amount),
      max_delivery_distance: Number(f.max_delivery_distance),
      max_driving_time: Number(f.max_driving_time),

      fee_type: f.fee_type,
      fixed_fee: Number(f.fixed_fee),
      range_fee: (f.range_fee || []).map((r: any) => ({
        min: Number(r.min),
        max: Number(r.max),
        fee: Number(r.fee),
      })),
      formula_fee: {
        base: Number(f.formula_fee.base),
        per_km: Number(f.formula_fee.per_km),
      },
      free_delivery_amount: Number(f.free_delivery_amount),
      restrict_fee_times: f.restrict_fee_times,

      delivery_zone_file: f.delivery_zone_file,

      enable_immediate_orders: this.boolToNum(f.enable_immediate_orders),
      enable_later_orders: this.boolToNum(f.enable_later_orders),
      first_order_offset: Number(f.first_order_offset),
      last_order_offset: Number(f.last_order_offset),
      max_days_ahead: Number(f.max_days_ahead),
      time_interval: Number(f.time_interval),
      order_offset: Number(f.order_offset),

      created_by: Number(f.created_by),
    };

    if (isUpdate && this.deliveryServiceId) {
      payload.delivery_service_id = this.deliveryServiceId;
    }

    console.log("Payload:", payload);

    this.deliveryService.saveDeliveryService(payload).subscribe({
      next: (res) => {
        console.log("Saved:", res);
        alert("Delivery service saved successfully!");
      },
      error: (err) => {
        console.error("Error:", err);
        alert("Failed to save delivery service.");
      },
    });
  }
}
