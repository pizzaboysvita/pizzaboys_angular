import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-order-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./order-dialog.component.html",
  styleUrl: "./order-dialog.component.scss",
})
export class OrderDialogComponent {
  @Input() data: any;

  statuses = ["Confirmed", "Ready", "Completed", "Delivered"];
  currentStatus: any;
  activeTab = "details";

  orderForm!: FormGroup;
  orderDishDetails: any[] = [];
  order_items: any[] = [];
  order_toppings: any[] = [];
  order_ingredients: any[] = [];
  totalOrdermerged: any[] = [];
  orderlogs: any[] = [];

  statusList = [
    { id: "Change Status", name: "Change Status" },
    { id: "Cancelled", name: "Cancelled" },
    { id: "Un-Confirmed", name: "Un-Confirmed" },
    { id: "Confirmed", name: "Confirmed" },
    { id: "Ready", name: "Ready" },
    { id: "Completed", name: "Completed" },
  ];

  action = [
    { id: 1, name: "Print Online-Customer" },
    { id: 2, name: "Print POS-Customer" },
    { id: 3, name: "Print POS Kitchen" },
    { id: 4, name: "Download PDF receipt" },
    { id: 5, name: "Archive Order" },
  ];

  modiftime = [
    { id: 1, name: "Add 5min" },
    { id: 2, name: "Add 10 min" },
    { id: 3, name: "Add 15 min" },
    { id: 4, name: "Add 20 min" },
    { id: 5, name: "Add 25 min" },
  ];

  constructor(
    private modal: NgbModal,
    private toastr: ToastrService,
    private session: SessionStorageService,
    private apis: ApisService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentStatus = this.data.order_status || "Confirmed";

    this.orderForm = this.fb.group({
      status: [this.currentStatus],
      modifyEstTime: [""],
      action: [""],
    });

    this.buildOrderLogs(this.data);

    // parse safely (some fields may be null or stringified JSON)
    this.orderDishDetails = safeParse(this.data.combo_details_json);
    this.order_items = safeParse(this.data.order_items);
    this.order_toppings = safeParse(this.data.order_toppings);
    this.order_ingredients = safeParse(this.data.order_ingredients);

    // merge toppings + ingredients into items for display
    this.totalOrdermerged = this.order_items.map((dish: any) => {
      const toppings = this.order_toppings
        .filter((opt: any) => opt.dish_id === dish.dish_id)
        .map(({ name, price, quantity }: any) => ({ name, price, quantity }));

      const ingredients = this.order_ingredients
        .filter((opt: any) => opt.dish_id === dish.dish_id)
        .map(({ name, price, quantity }: any) => ({ name, price, quantity }));

      // If your API provides item_total_price, use it; otherwise compute price * qty
      const item_total_price =
        dish.item_total_price ??
        (dish.price ? Number(dish.price || 0) * Number(dish.quantity || 1) : 0);

      return {
        ...dish,
        item_total_price,
        selected_options: [...toppings, ...ingredients],
      };
    });

    // fetch logs
    this.loadOrderLogs();
  }

  buildOrderLogs(orderData: any) {
    const logs = [];

    // 1️⃣ Print Request
    logs.push({
      id: 1,
      title: "PRINT REQUEST",
      description: 'Print request sent to printer "POS - Kitchen"',
      time: "30/10/2025 08:54 pm",
      type: "print",
    });

    // 2️⃣ Status changes (simulate timeline)
    const statusChanges = [
      { id: 2, from: "Confirmed", to: "Ready", time: "30/10/2025 09:15 pm" },
      { id: 6, from: "Ready", to: "Complete", time: "30/10/2025 09:25 pm" },
    ];

    statusChanges.forEach((s) => {
      logs.push({
        id: s.id,
        title: "UPDATE STATUS",
        description: `Updated from "${s.from}" to "${s.to}"`,
        time: s.time,
        type: "status",
      });
    });

    // 3️⃣ Edits (simulate multiple edits)
    logs.push(
      {
        id: 3,
        title: "EDITED",
        description: "",
        time: "30/10/2025 09:17 pm",
        type: "edit",
      },
      {
        id: 4,
        title: "EDITED",
        description: "",
        time: "30/10/2025 09:17 pm",
        type: "edit",
      },
      {
        id: 5,
        title: "EDITED",
        description: "",
        time: "30/10/2025 09:17 pm",
        type: "edit",
      }
    );

    // Sort logs (newest first)
    this.orderlogs = logs.sort((a, b) => b.id - a.id);
  }
  loadOrderLogs() {
    this.apis
      .getApi(
        `${AppConstants.api_end_points.orderList}?order_id=${this.data.order_master_id}&orderStatus=true&type=web`
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.code === 1) {
            // API returns categories array (you used that earlier)
            this.orderlogs = response.categories || [];
          } else {
            this.orderlogs = [];
          }
        },
        error: (err) => {
          console.error("Error loading logs:", err);
          this.orderlogs = [];
        },
      });
  }

  // helper to format currency safely
  formatPrice(value: any): string {
    const n = Number(value ?? 0);
    return n.toFixed(2);
  }

  // returns logs newest -> oldest
  get logsSorted(): any[] {
    return [...(this.orderlogs || [])].reverse();
  }

  // returns a user-friendly type (uppercase)
  getLogType(l: any): string {
    // prefer existing type fields or infer
    if (l.log_type) return String(l.log_type).toUpperCase();
    if (l.new_status || l.old_status) return "UPDATE STATUS";
    if (l.action && String(l.action).toLowerCase().includes("edit"))
      return "EDITED";
    if (l.message) return "INFO";
    return "LOG";
  }

  // build message text shown below the title
  getLogMessage(l: any): string {
    // many of your log entries contain old_status/new_status or message fields
    if (l.old_status || l.new_status) {
      return `Updated from "${l.old_status || "--"}" to "${
        l.new_status || "--"
      }"`;
    }
    if (l.message) return l.message;
    // fallback to raw JSON
    return JSON.stringify(l).slice(0, 200);
  }

  selectTab(tabName: string): void {
    this.activeTab = tabName;
  }

  transform(value: string | Date): string {
    if (!value) return "";
    const created = new Date(value).getTime();
    const diffMs = Date.now() - created;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
    return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  }
  updatedOrder() {
    const reqbody = {
      order_id: this.data.order_master_id,
      order_status: this.orderForm.value.status,
      updated_by: JSON.parse(
        this.session.getsessionStorage("loginDetails") as any
      ).user.user_id,
    };

    this.apis.putApi(AppConstants.api_end_points.orderList, reqbody).subscribe({
      next: (data: any) => {
        if ((data && data.code === "1") || 1) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: data.message || "Order details updated successfully.",
            confirmButtonColor: "#3085d6",
          }).then(() => {
            this.modal.dismissAll();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: data?.message || "Something went wrong. Please try again.",
          });
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to update order. Please check the network or try again later.",
        });
      },
    });
  }

  getStepClass(step: string) {
    const currentIndex = this.statuses.indexOf(this.currentStatus);
    const stepIndex = this.statuses.indexOf(step);
    return stepIndex <= currentIndex ? "progtrckr-done" : "progtrckr-todo";
  }
}

/** small utility outside the class to safely parse possible JSON strings */
function safeParse(value: any): any[] {
  if (!value) return [];
  try {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        (trimmed.startsWith("{") && trimmed.endsWith("}"))
      ) {
        return JSON.parse(trimmed);
      }
      return [];
    }
    if (Array.isArray(value)) return value;
    return [];
  } catch {
    return [];
  }
}
