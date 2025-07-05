import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { NgbModal, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";

@Component({
  selector: "app-add-category",
  standalone: true,
  imports: [NgbNavModule, NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.scss"],
})
export class AddCategoryComponent implements OnInit {
  active = 1;
  menuForm!: FormGroup;
  menuList: any[] = [];

  PlaceholderSubcategory = [
    { id: 1, name: "Subcategory Menu" },
    { id: 2, name: "Ethnic Wear" },
    { id: 3, name: "Ethnic Bottoms" },
    { id: 4, name: "Women Western Wear" },
    { id: 5, name: "Sandals" },
    { id: 6, name: "Shoes" },
    { id: 7, name: "Beauty & Grooming" },
  ];

  constructor(
    private fb: FormBuilder,
    public modal: NgbModal,
    private apis: ApisService,
    private session: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getMenuList();
  }

  initForm(): void {
    this.menuForm = this.fb.group({
      dish_menu_id: [null, Validators.required],
      name: ["", Validators.required],
      display_name: [""],
      description: [""],
      hide_category: [false],
      order_times: [""],
      services: [""],
      applicable_hours: [""],
      mark_as_age_restricted: [false],
      enable_pre_orders_only: [false],
      pre_order_days_in_advance: [""],
      pre_order_cutoff_time: [""],
      pre_order_applicable_service: [""],
      hide_restriction_warning: [false],
      hide_if_unavailable: [false],
      POS_display_name: [""],
      pos_color_code: [""],
      hide_category_in_POS: [false],
      pickup_surcharge: [""],
      delivery_surcharge: [""],
      managed_delivery_surcharge: [""],
      dine_in_surcharge: [""],
      status: [1],
    });
  }

  getMenuList(): void {
    const loginRaw = this.session.getsessionStorage("loginDetails");
    const loginData = loginRaw ? JSON.parse(loginRaw) : null;
    const userId = loginData?.user?.user_id;

    if (!userId) {
      console.error("User ID not found in session storage");
      return;
    }

    this.apis.getApi(`/api/menu?user_id=${userId}`).subscribe((res: any) => {
      if (res.code === "1") {
        this.menuList = res.data;
      } else {
        console.error("Failed to fetch menus:", res.message);
      }
    });
  }

  addCategory(event?: Event): void {
    if (event) event.preventDefault();

    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const loginRaw = this.session.getsessionStorage("loginDetails");
    const loginData = loginRaw ? JSON.parse(loginRaw) : null;
    const userId = loginData?.user?.user_id;
    const storeId = loginData?.user?.store_id;

    const formValue = this.menuForm.value;

    const payload = {
      ...formValue,
      hide_category: formValue.hide_category ? 1 : 0,
      mark_as_age_restricted: formValue.mark_as_age_restricted ? 1 : 0,
      enable_pre_orders_only: formValue.enable_pre_orders_only ? 1 : 0,
      hide_restriction_warning: formValue.hide_restriction_warning ? 1 : 0,
      hide_if_unavailable: formValue.hide_if_unavailable ? 1 : 0,
      hide_category_in_POS: formValue.hide_category_in_POS ? 1 : 0,
      pickup_surcharge: Number(formValue.pickup_surcharge) || 0,
      delivery_surcharge: Number(formValue.delivery_surcharge) || 0,
      managed_delivery_surcharge:
        Number(formValue.managed_delivery_surcharge) || 0,
      dine_in_surcharge: Number(formValue.dine_in_surcharge) || 0,
      type: "insert",
      store_id: storeId,
      created_by: userId,
      updated_by: userId,
    };

    this.apis.postApi("/api/category", payload).subscribe((res: any) => {
      if (res.code === "1") {
        alert("Category added successfully");
        this.modal.dismissAll("refresh");
      } else {
        alert(res.message || "Failed to add category");
      }
    });
  }
}
