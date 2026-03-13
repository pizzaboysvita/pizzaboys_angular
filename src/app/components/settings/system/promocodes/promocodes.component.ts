import { CommonModule } from "@angular/common";
import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AddPromocodeComponent } from "../add-promocode/add-promocode.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SettingsService } from "../../settings.service";
import { ApisService } from "../../../../shared/services/apis.service";
import Swal from "sweetalert2";
import { AppConstants } from "../../../../app.constants";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-promocodes",
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./promocodes.component.html",
  styleUrl: "./promocodes.component.scss",
})
export class PromocodesComponent {
  @ViewChild("confirmModal") confirmModalRef!: TemplateRef<any>;
  stores: any[] = [];
  limitMenus: any[] = [];
  freeMenus: any[] = [];
  promoCodes: any[] = [];
  allPromoCodes: any[] = [];
  promo: any = {
    type: "Insert",
    store_id: null,

    promo_name: "",
    promo_code: "",

    fixed_discount: 0,
    percent_discount: 0,

    free_delivery: false,

    min_order: 0,
    max_order: 0,
    max_uses: 0,

    service_type: null,
    order_time: null,

    once_per_customer: false,
    logged_in_only: false,

    auto_apply: false,

    limit_dishes: [],
    free_dishes: [],

    free_same_dish_only: false,
    free_quantity: 1,
    free_required_purchase_qty: 1,

    disable_promotion: false,

    created_by: 2,
  };
  promoRowData: any;
  modelRef: any;
  promoDetails: any;
  selectedStoreId: any = -1;
  promoList: any;
  selectedPromoId = {};
  storeList: any;
  constructor(
    private modalService: NgbModal,
    private settingsService: SettingsService,
    private modal: NgbModal,
    private apiService: ApisService,
  ) {}

  ngOnInit(): void {
    this.loadStores();
    this.loadPromoCodes();
  }

  loadStores() {
    this.settingsService.getStores().subscribe((res: any) => {
      this.stores = res;
    });
  }
  loadPromoCodes() {
    this.settingsService.getPromoCodes().subscribe((res: any) => {
      const promos = res?.data || res;

      this.allPromoCodes = promos;
      this.promoCodes = promos;
    });
  }

  openCreatePromoCodeModal() {
    this.modalService.open(AddPromocodeComponent, { size: "lg" });
  }

  onStoreChange() {
    if (!this.promo.store_id || this.promo.store_id.length === 0) {
      this.promoCodes = this.allPromoCodes;
      return;
    }

    const selectedStores = this.promo.store_id.map((id: any) => Number(id));

    this.promoCodes = this.allPromoCodes.filter((promo: any) => {
      if (!promo.store_id) return false;

      const promoStores = promo.store_id
        .toString()
        .split(",")
        .map((id: any) => Number(id));

      return selectedStores.some((storeId: number) =>
        promoStores.includes(storeId),
      );
    });
  }

  editPromo(promo: any, type: any) {
    console.log("Edit promo", promo, type);
    this.promoRowData = promo;
    if (type === "Edit") {
      this.insertPromo("Edit");
    } else if (type === "Delete") {
    }
  }

  deletePromo(promo: any) {
    this.promoDetails = promo;

    this.modelRef = this.modalService.open(this.confirmModalRef, {
      centered: true,
      backdrop: "static",
    });
  }
  insertPromo(type: any) {
    console.log("Promo Data Passing:", this.promoRowData);
    this.modelRef = this.modal.open(AddPromocodeComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "lg",
    });
    this.modelRef.componentInstance.type = type;
    this.modelRef.componentInstance.myData = this.promoRowData;

    this.modelRef.result.then(
      (result: any) => {
        if (result) {
          console.log("Option set saved and modal closed.");
          this.getStorePromoData();
        }
      },
      (reason: any) => {
        console.log("Modal dismissed", reason);
        this.getStorePromoData();
      },
    );
  }

  onConfirm() {
    const reqboy = {
      type: "delete",
      promo_id: this.promoDetails.promo_id,
    };

    // const formData = new FormData();
    // formData.append("body", JSON.stringify(reqboy));

    this.apiService
      .postApi(AppConstants.api_end_points.promoCode, reqboy)
      .subscribe((data: any) => {
        if (data.code == 1) {
          this.modelRef.close();

          Swal.fire({
            title: "Success!",
            text: data.message,
            icon: "success",
            width: "350px",
          }).then(() => {
            this.loadPromoCodes();
          });
        }
      });
  }
  getStorePromoData() {
    const promoApi = this.apiService.getApi(
      AppConstants.api_end_points.store_list +
        "?store_id=" +
        this.selectedStoreId,
    );
    const storeApi = this.apiService.getApi(
      `/api/promocode?store_id=` + this.selectedStoreId,
    );

    forkJoin([promoApi, storeApi]).subscribe(([promoRes, storeRes]: any) => {
      console.log(promoRes.data, storeRes);
      this.promoList = promoRes.data;
      console.log(this.promoList[0]);
      this.selectedPromoId = this.promoList[0];

      this.storeList = storeRes.stores;
    });
  }
}
