import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
} from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { SettingsService } from "../../settings.service";

@Component({
  selector: "app-create-fee",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: "./create-fee.component.html",
  styleUrls: ["./create-fee.component.scss"],
})
export class CreateFeeComponent {
  form: FormGroup;
  loading = signal(false);
  successMessage = signal("");
  errorMessage = signal("");
  isOpen = signal(true);

  days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  serviceOptions = ["PICKUP", "DELIVERY", "DINEIN", "TABLEBOOKING"];
  paymentOptions = [
    "Cash",
    "Card",
    "Stripe",
    "Windcave",
    "POLi Pay",
    "Paymark Online Eftpos",
    "Bambora APAC",
    "Mob. EFTPOS",
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.form = this.fb.group({
      fee_name: ["", Validators.required],
      fixed_fee: [0, Validators.min(0)],
      percent_fee: [0, [Validators.min(0), Validators.max(100)]],
      fee_match_condition: ["ANY", Validators.required],
      order_times: this.fb.array([]),
      services: [[]],
      payments: [[]],
      applicable_hours: this.fb.array([]),
      disable_fee: [false],
    });
  }

  // ---------- Order Times ----------
  get orderTimes() {
    return this.form.get("order_times") as FormArray;
  }
  addOrderTime() {
    this.orderTimes.push(
      this.fb.group({
        day: [""],
        start: [""],
        end: [""],
      })
    );
  }
  removeOrderTime(i: number) {
    this.orderTimes.removeAt(i);
  }

  // ---------- Applicable Hours ----------
  get applicableHours() {
    return this.form.get("applicable_hours") as FormArray;
  }
  addApplicableHour() {
    this.applicableHours.push(this.fb.group({ start: [""], end: [""] }));
  }
  removeApplicableHour(i: number) {
    this.applicableHours.removeAt(i);
  }

  // ---------- Modal ----------
  closeModal() {
    this.isOpen.set(false);
    this.resetForm();
  }

  private resetForm() {
    this.form.reset(
      {
        fixed_fee: 0,
        percent_fee: 0,
        fee_match_condition: "ANY",
        disable_fee: false,
        services: [],
        payments: [],
      },
      { emitEvent: false }
    );
    this.applicableHours.clear();
    this.orderTimes.clear();
  }

  // ---------- Submit ----------
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set("Please fill out all required fields.");
      return;
    }

    this.loading.set(true);
    this.successMessage.set("");
    this.errorMessage.set("");

    const payload = {
      store_id: 33, // TODO: dynamic from user context
      fee_name: this.form.value.fee_name,
      fixed_fee: this.form.value.fixed_fee,
      percent_fee: this.form.value.percent_fee,
      fee_match_condition: this.form.value.fee_match_condition,
      order_times: JSON.stringify(this.form.value.order_times || []),
      services: JSON.stringify(this.form.value.services || []),
      payments: JSON.stringify(this.form.value.payments || []),
      applicable_hours: JSON.stringify(this.form.value.applicable_hours || []),
      disable_fee: this.form.value.disable_fee ? 1 : 0,
      status: 1,
      created_by: 101, // TODO: dynamic from logged-in user
    };

    this.settingsService.createFee(payload).subscribe({
      next: () => {
        this.successMessage.set("Fee created successfully!");
        this.loading.set(false);
        this.resetForm();
      },
      error: (err: { error: { message: any } }) => {
        this.errorMessage.set(err.error?.message || "Something went wrong!");
        this.loading.set(false);
      },
    });
  }
}
