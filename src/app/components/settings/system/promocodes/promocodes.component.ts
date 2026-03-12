import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AddPromocodeComponent } from "../add-promocode/add-promocode.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SettingsService } from "../../settings.service";

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
  constructor(
    private modalService: NgbModal,
    private settingsService: SettingsService,
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
      .split(',')
      .map((id: string) => Number(id));

    return promoStores.some((id: number) => selectedStores.includes(id));

  });

}

  buildDishTree(categories: any[], dishes: any[]) {
    const menu: any = {
      menu_name: "Takeaway Menu",
      expanded: true,
      categories: [],
    };

    categories.forEach((cat) => {
      const catId = cat.id ?? cat.category_id;
      const catName = cat.name ?? cat.category_name;

      const category: any = {
        category_id: catId,
        category_name: catName,
        expanded: false,
        dishes: dishes
          .filter((d: any) => (d.dish_category_id ?? d.category_id) == catId)
          .map((d: any) => ({
            id: d.dish_id ?? d.id,
            name: d.display_name ?? d.dish_name ?? d.name,
          })),
      };

      menu.categories.push(category);
    });

    return [menu];
  }

  editPromo(promo: any) {
    console.log("Edit promo", promo);
  }

  deletePromo(promo: any) {
    console.log("Delete promo", promo);
  }
}
