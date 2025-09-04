import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NgbActiveModal,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { SettingsService } from "../../settings.service";

@Component({
  selector: "app-add-promocode",
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: "./add-promocode.component.html",
  styleUrl: "./add-promocode.component.scss",
})
export class AddPromocodeComponent {
  promoCode: any = {
    store_id: null,
    promo_name: "",
    promo_code: "",
    fixed_discount: 0,
    percent_discount: 0,
    free_delivery: false,
    min_order: 0,
    max_order: 0,
    max_uses: 0,
    once_per_customer: false,
    logged_in_only: false,
    auto_apply: false,
    start_datetime: null,
    end_datetime: null,
    is_active: true,
    service_type: null,
    order_time: null,
    limit_dishes: [],
    free_dishes: [],
    free_quantity: 1,
    free_required_purchase_qty: 1,
    free_same_dish_only: false,
    disable_promotion: false,
    created_by: null,
  };

  startDateModel: NgbDateStruct | null = null;
  startTimeModel: string | null = null;
  endDateModel: NgbDateStruct | null = null;
  endTimeModel: string | null = null;
  showDateFields: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private promoCodeService: SettingsService
  ) {}

  toggleDateFields() {
    this.showDateFields = !this.showDateFields;
    if (!this.showDateFields) {
      this.startDateModel = null;
      this.startTimeModel = null;
      this.endDateModel = null;
      this.endTimeModel = null;
      this.promoCode.start_datetime = null;
      this.promoCode.end_datetime = null;
    }
  }

  savePromoCode() {
    this.promoCode.store_id = 123;
    this.promoCode.created_by = 456; 

    if (this.showDateFields) {
      const startDateTime =
        this.startDateModel && this.startTimeModel
          ? new Date(
              this.startDateModel.year,
              this.startDateModel.month - 1,
              this.startDateModel.day,
              parseInt(this.startTimeModel.split(":")[0], 10),
              parseInt(this.startTimeModel.split(":")[1], 10)
            )
          : null;

      const endDateTime =
        this.endDateModel && this.endTimeModel
          ? new Date(
              this.endDateModel.year,
              this.endDateModel.month - 1,
              this.endDateModel.day,
              parseInt(this.endTimeModel.split(":")[0], 10),
              parseInt(this.endTimeModel.split(":")[1], 10)
            )
          : null;

      this.promoCode.start_datetime = startDateTime
        ? startDateTime.toISOString()
        : null;
      this.promoCode.end_datetime = endDateTime
        ? endDateTime.toISOString()
        : null;
    }

    const promoCodePayload = {
      ...this.promoCode,
      fixed_discount: Number(this.promoCode.fixed_discount) || 0,
      percent_discount: Number(this.promoCode.percent_discount) || 0,
      min_order: Number(this.promoCode.min_order) || 0,
      max_order: Number(this.promoCode.max_order) || 0,
      max_uses: Number(this.promoCode.max_uses) || 0,
      free_quantity: Number(this.promoCode.free_quantity) || 0,
      free_required_purchase_qty:
        Number(this.promoCode.free_required_purchase_qty) || 0,
      free_delivery: this.promoCode.free_delivery ? 1 : 0,
      once_per_customer: this.promoCode.once_per_customer ? 1 : 0,
      logged_in_only: this.promoCode.logged_in_only ? 1 : 0,
      auto_apply: this.promoCode.auto_apply ? 1 : 0,
      is_active: this.promoCode.is_active ? 1 : 0,
      free_same_dish_only: this.promoCode.free_same_dish_only ? 1 : 0,
      disable_promotion: this.promoCode.disable_promotion ? 1 : 0,
    };

    this.promoCodeService.createPromoCode(promoCodePayload).subscribe({
      next: (response) => {
        console.log("API Response:", response);
        this.activeModal.close("Promo code saved successfully");
      },
      error: (error) => {
        console.error("API Error:", error);
      },
    });
  }
}
