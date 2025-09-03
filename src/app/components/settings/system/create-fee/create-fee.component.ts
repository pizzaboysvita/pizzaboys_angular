import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SettingsService } from "../../settings.service";

@Component({
  selector: "app-create-fee",
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: "./create-fee.component.html",
  styleUrl: "./create-fee.component.scss",
})
export class CreateFeeComponent {
  fee: any = {
    store_id: null,
    name: "",
    fixed_fee: 0,
    percent_fee: 0,
    match_condition: "any",
    order_times: null,
    services: null,
    payments: null,
    applicable_hours: [],
    disable_fee: false,
    created_by: null,
  };

  showTimeSlots: boolean = false;
  startTime: string | null = null;
  endTime: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private settingsService: SettingsService
  ) {}

  toggleTimeSlots() {
    this.showTimeSlots = !this.showTimeSlots;
    if (!this.showTimeSlots) {
      this.startTime = null;
      this.endTime = null;
      this.fee.applicable_hours = [];
    }
  }

  saveFee() {
    this.fee.store_id = 123;
    this.fee.created_by = 456;

    if (this.showTimeSlots && this.startTime && this.endTime) {
      this.fee.applicable_hours = [
        {
          start: this.startTime,
          end: this.endTime,
        },
      ];
    }

    const feePayload = {
      ...this.fee,
      fixed_fee: Number(this.fee.fixed_fee) || 0,
      percent_fee: Number(this.fee.percent_fee) || 0,
      disable_fee: this.fee.disable_fee ? 1 : 0,
    };

    // this.settingsService.createFee(feePayload).subscribe({
    //   next: (response: any) => {
    //     console.log("Fee created:", response);
    //     this.activeModal.close("Fee saved successfully");
    //   },
    //   error: (error: any) => {
    //     console.error("Error creating fee:", error);
    //   },
    // });
  }
}
