import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  NgbActiveModal,
  NgbDateStruct,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { SettingsService } from "../../settings.service";

interface DateRange {
  start: NgbDateStruct | null;
  end: NgbDateStruct | null;
}

@Component({
  selector: "app-add-promocode",
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, NgSelectModule,ReactiveFormsModule],
  templateUrl: "./add-promocode.component.html",
  styleUrls: ["./add-promocode.component.scss"],
})
export class AddPromocodeComponent implements OnInit {
   @Input() type: any;
  @Input() myData: any;
  stores: any[] = [];
  limitMenus: any[] = [];
  freeMenus: any[] = [];
  reqbody: any

  dateRanges: DateRange[] = [];

  serviceOptions = [
    { label: "Delivery", value: "delivery" },
    { label: "Collection", value: "collection" },
    { label: "Dine In", value: "dine_in" },
  ];

  orderTimeOptions = [
    { label: "ASAP", value: "asap" },
    { label: "Pre-order", value: "preorder" },
  ];

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
  sessionStorage: any;

  constructor(
    public activeModal: NgbActiveModal,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
      if (this.type === "Edit" && this.myData) {
        console.log(this.myData,"mydata");
        
    this.promo = { ...this.myData };
    this.onStoreChange();
    // if (this.promo.store_id) {
    //   this.promo.store_id = (this.promo.store_id);
    // }

  }
    this.loadStores();
  }

  /* ---------------- STORES ---------------- */

  loadStores() {
    this.settingsService.getStores().subscribe((res: any) => {
      this.stores = res;
    });
  }

  /* ---------------- STORE CHANGE ---------------- */

  onStoreChange() {
    if (!this.promo.store_id) return;
    this.limitMenus = [];
    this.freeMenus = [];

    this.settingsService
      .getCategories(this.promo.store_id)
      .subscribe((catRes: any) => {
        const categories = catRes?.categories || [];
        console.log("[Promo] categories:", categories.length, catRes);

        this.settingsService
          .getDishes(this.promo.store_id)
          .subscribe((dishRes: any) => {
            const dishes = dishRes?.data || [];
            console.log("[Promo] dishes:", dishes.length, dishRes);

            this.limitMenus = this.buildDishTree(categories, dishes);
            this.freeMenus = this.buildDishTree(categories, dishes);
          });
      });
  }

  /* ---------------- BUILD TREE ---------------- */

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
  /* ---------------- TREE TOGGLE ---------------- */

  toggleMenu(menu: any, treeType: "limit" | "free") {
    menu.expanded = !menu.expanded;
    if (treeType === "limit") {
      this.limitMenus = [...this.limitMenus];
    } else {
      this.freeMenus = [...this.freeMenus];
    }
  }

  toggleCategory(category: any, treeType: "limit" | "free") {
    category.expanded = !category.expanded;

    if (treeType === "limit") {
      this.limitMenus = [...this.limitMenus];
    } else {
      this.freeMenus = [...this.freeMenus];
    }
  }

  /* ---------------- LIMIT DISH ---------------- */

  toggleLimitDish(id: number, event: any) {
    if (event.target.checked) {
      if (!this.promo.limit_dishes.includes(id))
        this.promo.limit_dishes.push(id);
    } else {
      this.promo.limit_dishes = this.promo.limit_dishes.filter(
        (x: any) => x !== id,
      );
    }
  }

  toggleAllLimitDishesInCategory(category: any, event: any) {
    const ids = category.dishes.map((d: any) => d.id);
    if (event.target.checked) {
      ids.forEach((id: number) => {
        if (!this.promo.limit_dishes.includes(id))
          this.promo.limit_dishes.push(id);
      });
    } else {
      this.promo.limit_dishes = this.promo.limit_dishes.filter(
        (x: any) => !ids.includes(x),
      );
    }
  }

  toggleAllLimitDishesInMenu(menu: any, event: any) {
    menu.categories.forEach((cat: any) => {
      this.toggleAllLimitDishesInCategory(cat, event);
    });
  }

  isCategoryAllLimitChecked(category: any): boolean {
    return (
      category.dishes.length > 0 &&
      category.dishes.every((d: any) => this.promo.limit_dishes.includes(d.id))
    );
  }

  isCategoryLimitIndeterminate(category: any): boolean {
    const checked = category.dishes.filter((d: any) =>
      this.promo.limit_dishes.includes(d.id),
    ).length;
    return checked > 0 && checked < category.dishes.length;
  }

  isMenuAllLimitChecked(menu: any): boolean {
    return menu.categories.every((c: any) => this.isCategoryAllLimitChecked(c));
  }

  isMenuLimitIndeterminate(menu: any): boolean {
    const total = menu.categories.reduce(
      (sum: number, c: any) => sum + c.dishes.length,
      0,
    );
    const checked = menu.categories.reduce(
      (sum: number, c: any) =>
        sum +
        c.dishes.filter((d: any) => this.promo.limit_dishes.includes(d.id))
          .length,
      0,
    );
    return checked > 0 && checked < total;
  }

  /* ---------------- FREE DISH ---------------- */

  toggleFreeDish(id: number, event: any) {
    if (event.target.checked) {
      if (!this.promo.free_dishes.includes(id)) this.promo.free_dishes.push(id);
    } else {
      this.promo.free_dishes = this.promo.free_dishes.filter(
        (x: any) => x !== id,
      );
    }
  }

  toggleAllFreeDishesInCategory(category: any, event: any) {
    const ids = category.dishes.map((d: any) => d.id);
    if (event.target.checked) {
      ids.forEach((id: number) => {
        if (!this.promo.free_dishes.includes(id))
          this.promo.free_dishes.push(id);
      });
    } else {
      this.promo.free_dishes = this.promo.free_dishes.filter(
        (x: any) => !ids.includes(x),
      );
    }
  }

  toggleAllFreeDishesInMenu(menu: any, event: any) {
    menu.categories.forEach((cat: any) => {
      this.toggleAllFreeDishesInCategory(cat, event);
    });
  }

  isCategoryAllFreeChecked(category: any): boolean {
    return (
      category.dishes.length > 0 &&
      category.dishes.every((d: any) => this.promo.free_dishes.includes(d.id))
    );
  }

  isCategoryFreeIndeterminate(category: any): boolean {
    const checked = category.dishes.filter((d: any) =>
      this.promo.free_dishes.includes(d.id),
    ).length;
    return checked > 0 && checked < category.dishes.length;
  }

  isMenuAllFreeChecked(menu: any): boolean {
    return menu.categories.every((c: any) => this.isCategoryAllFreeChecked(c));
  }

  isMenuFreeIndeterminate(menu: any): boolean {
    const total = menu.categories.reduce(
      (sum: number, c: any) => sum + c.dishes.length,
      0,
    );
    const checked = menu.categories.reduce(
      (sum: number, c: any) =>
        sum +
        c.dishes.filter((d: any) => this.promo.free_dishes.includes(d.id))
          .length,
      0,
    );
    return checked > 0 && checked < total;
  }

  /* ---------------- DATE RANGES ---------------- */

  addDateRange() {
    this.dateRanges.push({ start: null, end: null });
  }

  removeDateRange(index: number) {
    this.dateRanges.splice(index, 1);
  }

  duplicateDateRange(index: number) {
    const range = this.dateRanges[index];
    this.dateRanges.splice(index + 1, 0, { ...range });
  }

  private ngbDateToISO(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    return new Date(date.year, date.month - 1, date.day).toISOString();
  }

  /* ---------------- SAVE PROMO ---------------- */

// savePromoCode() {

//   const start_datetime =
//     this.dateRanges.length > 0
//       ? this.ngbDateToISO(this.dateRanges[0].start)
//       : null;

//   const end_datetime =
//     this.dateRanges.length > 0
//       ? this.ngbDateToISO(this.dateRanges[0].end)
//       : null;

//   const payload = {
//     ...this.promo,

   

//     type: "insert",
    
//     store_id: this.promo.store_id
//   ? this.promo.store_id.join(",")
//   : null,

//     start_datetime,
//     end_datetime,

//     service_type: this.promo.service_type
//       ? this.promo.service_type.join(",")
//       : null,

//     order_time: this.promo.order_time
//       ? this.promo.order_time.join(",")
//       : null,

//     free_delivery: this.promo.free_delivery ? 1 : 0,
//     once_per_customer: this.promo.once_per_customer ? 1 : 0,
//     logged_in_only: this.promo.logged_in_only ? 1 : 0,
//     auto_apply: this.promo.auto_apply ? 1 : 0,
//     free_same_dish_only: this.promo.free_same_dish_only ? 1 : 0,
//     disable_promotion: this.promo.disable_promotion ? 1 : 0
//   };

//   console.log("PROMO PAYLOAD", payload);
//   console.log("STORE ID TYPE:", typeof this.promo.store_id);
// console.log("STORE ID VALUE:", this.promo.store_id);

//   this.settingsService.createPromoCode(payload).subscribe({
//     next: (res: any) => {
//       console.log("Promo created", res);
//       this.activeModal.close("saved");
//     },
//     error: (err: any) => {
//       console.error(err);
//     },
//   });
// }
savePromoCode() {

  const start_datetime =
    this.dateRanges.length > 0
      ? this.ngbDateToISO(this.dateRanges[0].start)
      : null;

  const end_datetime =
    this.dateRanges.length > 0
      ? this.ngbDateToISO(this.dateRanges[0].end)
      : null;

  if (this.type === "Edit") {

    this.reqbody = {
      ...this.promo,
      type: "update",
      promo_id: this.promo.promo_id,

      store_id: this.promo.store_id || null,

      start_datetime,
      end_datetime,

      service_type: Array.isArray(this.promo.service_type)
        ? this.promo.service_type.join(",")
        : this.promo.service_type,

      order_time: Array.isArray(this.promo.order_time)
        ? this.promo.order_time.join(",")
        : this.promo.order_time,

      free_delivery: this.promo.free_delivery ? 1 : 0,
      once_per_customer: this.promo.once_per_customer ? 1 : 0,
      logged_in_only: this.promo.logged_in_only ? 1 : 0,
      auto_apply: this.promo.auto_apply ? 1 : 0,
      free_same_dish_only: this.promo.free_same_dish_only ? 1 : 0,
      disable_promotion: this.promo.disable_promotion ? 1 : 0,

      
      limit_dishes: this.promo.limit_dishes || 0,
      free_dishes: this.promo.free_dishes || 0,
      

      created_at: this.promo.created_at,
      updated_at: new Date()
    };

  } else {

    this.reqbody = {
      ...this.promo,
      type: "insert",

      store_id: this.promo.store_id || null,

      start_datetime,
      end_datetime,

      service_type: Array.isArray(this.promo.service_type)
        ? this.promo.service_type.join(",")
        : this.promo.service_type,

      order_time: Array.isArray(this.promo.order_time)
        ? this.promo.order_time.join(",")
        : this.promo.order_time,

      free_delivery: this.promo.free_delivery ? 1 : 0,
      once_per_customer: this.promo.once_per_customer ? 1 : 0,
      logged_in_only: this.promo.logged_in_only ? 1 : 0,
      auto_apply: this.promo.auto_apply ? 1 : 0,
      free_same_dish_only: this.promo.free_same_dish_only ? 1 : 0,
      disable_promotion: this.promo.disable_promotion ? 1 : 0,

      
      limit_dishes: this.promo.limit_dishes || 0,
      free_dishes: this.promo.free_dishes || 0,
    };

  }

  console.log("PROMO PAYLOAD", this.reqbody);

  this.settingsService.createPromoCode(this.reqbody).subscribe({
    next: (res: any) => {
      console.log("Promo saved", res);
      this.activeModal.close("saved");
    },
    error: (err: any) => {
      console.error(err);
    },
  });
}
}
