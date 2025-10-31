import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AppConstants } from "../../../app.constants";
import { ApisService } from "../../../shared/services/apis.service";

@Component({
  selector: "app-orderprintdialog",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./orderprintdialog.component.html",
  styleUrls: ["./orderprintdialog.component.scss"],
})
export class OrderprintdialogComponent implements OnInit {
  @Input() data: any;
  storeDetails: any = {};
  orderItems: any[] = [];
  paymentDetails: any[] = [];
  showSplitDetails = false;
  selectedSplitIndex: number = -1;

  constructor(public activeModal: NgbActiveModal, private apis: ApisService) {}

  ngOnInit(): void {
    try {
      this.orderItems =
        typeof this.data?.order_items === "string"
          ? JSON.parse(this.data.order_items)
          : this.data?.order_items || [];
    } catch {
      this.orderItems = [];
    }

    try {
      this.paymentDetails =
        typeof this.data?.payments === "string"
          ? JSON.parse(this.data.payments)
          : this.data?.payments || [];
    } catch {
      this.paymentDetails = [];
    }

    if (this.paymentDetails?.length) {
      this.paymentDetails = this.paymentDetails.map((p: any) => {
        try {
          p.splits_percentage =
            typeof p.splits_percentage === "string"
              ? JSON.parse(p.splits_percentage)
              : p.splits_percentage || [];
          p.splits_users =
            typeof p.splits_users === "string"
              ? JSON.parse(p.splits_users)
              : p.splits_users || [];
          p.splits_items =
            typeof p.splits_items === "string"
              ? JSON.parse(p.splits_items)
              : p.splits_items || [];
        } catch {
          p.splits_percentage = [];
          p.splits_users = [];
          p.splits_items = [];
        }
        return p;
      });
    }
    this.getStoreList();
  }
  trackByTitle(index: number, item: any) {
    return item.title;
  }

  getStoreList(): void {
    this.apis
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data: any) => {
        if (Array.isArray(data)) {
          data.forEach((element: any) => {
            element.status =
              element.status == 1
                ? "Active"
                : element.status == 0
                ? "Inactive"
                : element.status;
          });

          const store = data.find(
            (x: any) => x.store_id === this.data?.store_id
          );

          if (store) {
            this.storeDetails = store;
          } else {
            console.warn("Store not found for store_id:", this.data?.store_id);
          }
        }
      });
  }

  print(): void {
    const printSection = document.getElementById("print-section");
    if (!printSection) return;

    let printContent = printSection.innerHTML;
    if (this.selectedSplitIndex > -1 && this.paymentDetails?.length) {
      const payment = this.paymentDetails[this.selectedSplitIndex];

      let filteredItems = this.orderItems;
      if (payment.splits_items?.length) {
        const itemNames = payment.splits_items.map((x: any) => x.item_name);
        filteredItems = this.orderItems.filter((i) =>
          itemNames.includes(i.dish_name)
        );
      }

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = printContent;

      const tbody = tempDiv.querySelector("tbody");
      if (tbody) {
        tbody.innerHTML = filteredItems
          .map(
            (i) => `
          <tr>
            <td>${i.quantity}</td>
            <td>${i.dish_name}</td>
            <td class="right">$${(+i.price).toFixed(2)}</td>
          </tr>`
          )
          .join("");
      }

      const totalDiv = tempDiv.querySelector(".summary");
      if (totalDiv) {
        totalDiv.innerHTML = `
        <div class="line-row"><span>Subtotal</span><span>$${
          payment.amount?.toFixed(2) || "0.00"
        }</span></div>
        <div class="dotted"></div>
        <div class="line-row total"><strong>Total Paid (${
          payment.payment_method
        })</strong><strong>$${
          payment.amount?.toFixed(2) || "0.00"
        }</strong></div>
      `;
      }

      if (
        payment.splits_percentage?.length &&
        payment.splits_percentage[0]?.user_name
      ) {
        const payerName = payment.splits_percentage[0].user_name;
        const titleEl = tempDiv.querySelector(".title");
        if (titleEl) {
          titleEl.insertAdjacentHTML(
            "afterend",
            `<p><strong>Customer:</strong> ${payerName}</p>`
          );
        }
      }

      const orderId = tempDiv.querySelector(".order-id");
      if (orderId) {
        orderId.innerHTML += ` (Split ${this.selectedSplitIndex + 1})`;
      }

      printContent = tempDiv.innerHTML;
    }

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>${this.getPrintStyles()}</style>
      </head>
      <body>${printContent}</body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => printWindow.close();
  }

  private getPrintStyles(): string {
    return `
    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', sans-serif;
      background: #fff;
      margin: 0;
      padding: 10px;
      color: #000;
    }

    .receipt {
      width: 200px;
      margin: auto;
      font-size: 13px;
      line-height: 1.4;
      color: #000;
      padding: 5px 10px;
    }

    .title {
      font-weight: 700;
      font-size: 16px;
      margin: 0;
      text-align: center;
    }

    p {
      text-align: center;
      margin: 2px 0;
    }

    .order-id {
      font-weight: bold;
      font-size: 15px;
      margin: 10px 0 5px 0;
      text-align: left;
    }

    .info, .summary {
      text-align: left;
      margin-top: 6px;
    }

    .line-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      line-height: 1.3;
      width: 100%;
      white-space: nowrap;
    }

    .line-row span:first-child { text-align: left; }
    .line-row span:last-child { text-align: right; }

    .dotted {
      border-bottom: 1px dotted #000;
      width: 100%;
      margin: 2px 0;
    }

    .items {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      text-align: left;
    }

    .items th {
      border-bottom: 1px solid #000;
      font-weight: bold;
      font-size: 13px;
      padding-bottom: 3px;
    }

    .items td {
      padding: 2px 0;
      font-size: 13px;
      vertical-align: top;
    }

    .right { text-align: right; }

    small {
      font-size: 11px;
      color: #555;
    }

    /* === Totals Section === */
    .summary .total {
      margin-top: 4px;
      font-weight: bold;
      font-size: 14px;
    }

    .solid {
      border-top: 1px solid #000;
      border-bottom: none;
      margin: 6px 0;
    }
    .split-section {
      text-align: left;
      font-size: 13px;
      margin-top: 6px;
    }
    .split-section .fw-bold {
      font-weight: bold;
      font-size: 13px;
    }
    .split-section .line-row {
      display: flex;
      justify-content: space-between;
      white-space: nowrap;
      font-size: 13px;
    }
    .split-section hr.solid {
      border: none;
      border-top: 1px solid #000;
      margin: 4px 0;
    }

    @media print {
      @page {
        size: 80mm auto;
        margin: 3mm;
      }
        
     .no-print, 
     .modal-footer, 
     .btn-close {
       display: none !important;


      body {
        margin: 0;
        background: #fff;
      }

      .btn-close, .modal-footer {
        display: none !important;
      }

      .receipt {
        padding: 0 5px;
      }
    }
  `;
  }
  toggleSplitView(): void {
    this.showSplitDetails = !this.showSplitDetails;
  }

  getSplitDetails(): any[] {
    if (!this.paymentDetails?.length) return [];

    const sections: any[] = [];
    this.paymentDetails.forEach((payment: any, idx: number) => {
      const title = `Payment ${idx + 1} (${
        payment.payment_method || "Unknown"
      }) - $${payment.amount?.toFixed(2) || 0}`;
      const data: string[] = [];

      if (payment.splits_percentage?.length) {
        payment.splits_percentage.forEach((s: any) => {
          data.push(
            `${s.user_name || "User"} - ${s.percentage || 0}% : $${
              s.amount?.toFixed(2) || 0
            }`
          );
        });
      }

      if (payment.splits_items?.length) {
        payment.splits_items.forEach((s: any) => {
          data.push(`${s.item_name || "Item"} : $${s.amount?.toFixed(2) || 0}`);
        });
      }

      if (payment.splits_users?.length) {
        payment.splits_users.forEach((s: any) => {
          data.push(`${s.user_name || "User"} : $${s.amount?.toFixed(2) || 0}`);
        });
      }

      sections.push({ title, data });
    });

    return sections;
  }
}
