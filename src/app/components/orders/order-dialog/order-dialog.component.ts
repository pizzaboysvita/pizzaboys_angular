import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
  modiftime=[
    {id:1,name:'Add 5min'},
    {id:2,name:'Add 10 min'},
    {id:3,name:'Add 15 min'},
    {id:4,name:'Add 20 min'},
    {id:5,name:'Add 25 min'},
  ]
  refundModal: boolean;
  refundData: any;
refundForm:FormGroup
  maxRefundAmount: any;
  refundItems: any;
  discountAmount: number;
  paidAmount: number;
  constructor(public modal: NgbModal,public activeModal: NgbActiveModal,private toastr: ToastrService,private session:SessionStorageService,private apis: ApisService,private fb:FormBuilder) {}

  ngOnInit(): void {
    console.log(this.data,"data");
    
    this.currentStatus = this.data.order_status || "Confirmed";

    this.orderForm = this.fb.group({
      status: [this.currentStatus],
      modifyEstTime: [""],
      action: [""],
    });
this.refundForm = this.fb.group({
     refundType: ['FULL', Validators.required],
       total_price: [0, [Validators.required, Validators.min(0)]],
      payment_method: ['Cash'],
      reason:['']
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
        .filter((opt: any) => opt?.dish_id === dish?.dish_id)
        .map(({ name, price, quantity }: any) => ({ name, price, quantity }));

      const ingredients = this.order_ingredients
        .filter((opt: any) => opt?.dish_id === dish?.dish_id)
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
closeOrdersModal(){
  this.activeModal.close();
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
//   onRefundTypeChange() {
//   if (this.refundForm.value.refundType === 'FULL') {
//     this.setFullRefund();
//   } else {
//     this.refundForm.patchValue({ total_price: 0 });
//     this.refundItems.forEach((i: { checked: boolean; }) => (i.checked = false));
//   }
// }
onRefundTypeChange() {
  const refundType = this.refundForm.value.refundType;

  if (refundType === 'FULL') {

    // ✅ Select all
    this.refundItems.forEach((item: { checked: boolean; }) => item.checked = true);

    const total = this.refundItems.reduce(
      (sum: number, item: { price: any; }) => sum + Number(item.price),
      0
    );

    this.refundForm.patchValue({
      total_price: total.toFixed(2)
    });

  } else {

    // ✅ Unselect all
    this.refundItems.forEach((item: { checked: boolean; }) => item.checked = false);

    this.refundForm.patchValue({
      total_price: 0
    });
  }
}

// toggleItem(item: any) {
//   item.checked = !item.checked;

//   const total = this.refundItems
//     .filter((i: { checked: any; }) => i.checked)
//     .reduce((sum: number, i: { price: any; }) => sum + Number(i.price), 0);

//   this.refundForm.patchValue({
//     total_price: total
//   });
// }
toggleItem(item: any) {
  item.checked = !item.checked;

  const selectedItems = this.refundItems.filter((i: { checked: any; }) => i.checked);
  const selectedTotal = selectedItems.reduce(
    (sum: number, i: { price: any; }) => sum + Number(i.price),
    0
  );

  const allSelected =
    selectedItems.length === this.refundItems.length;

  let refundAmount = selectedTotal;

  // ✅ Apply discount ONLY if all items selected
  if (allSelected && this.discountAmount > 0) {
    refundAmount = selectedTotal - this.discountAmount;

    // safety (never exceed what customer paid)
    refundAmount = Math.min(refundAmount, this.paidAmount);
  }

  this.refundForm.patchValue({
    total_price: +refundAmount.toFixed(2)
  });
}


setFullRefund() {
  this.refundForm.patchValue({
    total_price: this.refundData.payment_amount
  });
}

 openRefundModal(data:any){
    this.refundForm.patchValue({ refundType: "FULL" });
  console.log(data);
  this.refundData=data
  this.discountAmount = Number(this.refundData.discount_amount || 0);
  this.paidAmount = Number(this.refundData.payment_amount);
  this.refundItems = [];
 const items = JSON.parse(this.refundData.order_items || '[]');
  items.forEach((item: any) => {
    this.refundItems.push({
      dish_id: item.id,
      dish_name: item.dish_name,
      price: Number(item.price),
      checked: false,
      type: 'DISH',
      order_details_id:item.order_details_id,
      order_status:item.order_status
      
    });
  });

  this.refundForm.patchValue({
  total_price: this.refundData?.payment_amount ||0,
  payment_method: this.refundData?.payment_method || 'Cash'
});
    this.maxRefundAmount = data?.payment_amount;

    const totalPriceCtrl = this.refundForm.get('total_price');

    totalPriceCtrl?.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(this.maxRefundAmount)
    ]);

    totalPriceCtrl?.setValue(this.maxRefundAmount); // default full refund
    totalPriceCtrl?.updateValueAndValidity();
    this.refundModal=true
    this.onRefundTypeChange();
  }
   submitRefund() {
    if (this.refundForm.invalid) return;
    console.log(this.refundForm.value);
  }
  get orderAddress(): string {
    // Delivery address priority
    if (this.data?.delivery_address) {
      return this.data.delivery_address;
    }

    // If address is split into fields
    const parts = [
      this.data?.address_line1,
      this.data?.address_line2,
      this.data?.city,
      this.data?.state,
      this.data?.pincode,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "--";
  }
   saveRefund(){
   if (this.refundForm.invalid) return;
  // "order_details": "899,113.94", // "892,18.99|893,5.50"
    const refundType = this.refundForm.value.refundType;
  // if (refundType === 'FULL') {
  //   // FULL refund → send single order_details_id with full amount
  //   orderDetailsString = `${this.refundData.order_details_id},${this.refundForm.value.total_price}`;
  // } 
  // else if (refundType === 'PARTIAL') {
  //   const selectedItems = this.refundItems.filter((i: { checked: any; }) => i.checked);
  //   orderDetailsString = selectedItems
  //     .map((item: { order_details_id: any; price: any; }) => `${item.order_details_id},${item.price}`)
  //     .join('|');
  // }
let itemsToProcess = [];
if (refundType === 'FULL') {
  // Send ALL items
  itemsToProcess = this.refundItems;
} 
else if (refundType === 'PARTIAL') {
  // Send only selected items
  itemsToProcess = this.refundItems.filter((i: { checked: any; }) => i.checked);
}
// Build string: id,amount|id,amount
const orderDetailsString = itemsToProcess
  .map((item: { order_details_id: any; price: any; }) => `${item.order_details_id},${item.price}`)
  .join('|');
    const reqbody = {
      order_master: this.data.order_master_id,
      order_details: orderDetailsString,
      created_by: JSON.parse(
        this.session.getsessionStorage("loginDetails") as any
      ).user.user_id,
    };


  console.log(reqbody); // check before API call

  this.apis.putApi(AppConstants.api_end_points.refund, reqbody).subscribe({
    next: (data: any) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data.message || "Refund processed successfully.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        this.refundModal = false;
      });
    },
    error: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Refund failed. Please try again.",
      });
    },
  });

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
