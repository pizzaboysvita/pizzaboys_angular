import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"; 
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";

@Component({
  selector: "app-order-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./order-dialog.component.html",
  styleUrl: "./order-dialog.component.scss",
})
export class OrderDialogComponent {
  @Input() data: any;

  activeTab = "details";
  statusExpanded = false;
  readyTimeExpanded = false;
  actionsExpanded = false;
  statusList: any[] = [
    { id: 1, name: "Change Status" },
    { id: 2, name: "Cancelled" },
    { id: 3, name: "Un-Confirmed" },
    { id: 4, name: "Confirmed" },
    { id: 5, name: "Ready" },
    { id: 6, name: "Completed" },
  ];
   action: any[] = [
    { id: 1, name: "Print Online-Customer" },
    { id: 2, name: "Print POS-Customer" },
    { id: 3, name: "Print POS Kitchen" },
    { id: 4, name: "Download PDF receipt" },
    { id: 5, name: "Archive Order " },
   
  ];
  modiftime=[
    {id:1,name:'Add 5min'},
    {id:2,name:'Add 10 min'},
    {id:3,name:'Add 15 min'},
    {id:4,name:'Add 20 min'},
    {id:5,name:'Add 25 min'},
  ]
  constructor(public activeModal: NgbActiveModal, private apis: ApisService) {}

  ngOnInit(): void {
    // Initialization logic here
    console.log(this.data.order_master_id, 'order dialog data');
    let result1 = this.data.order_master_id.replace("P-", "")
    this.apis.getApi(AppConstants.api_end_points.orderList + '?order_id=' + result1 + '&type=web').subscribe(response => {
      console.log(response, 'order details');
    });
  }

  selectTab(tabName: string): void {
    this.activeTab = tabName;
  }

  toggleStatus(): void {
    this.statusExpanded = !this.statusExpanded;
  }

  toggleReadyTime(): void {
    this.readyTimeExpanded = !this.readyTimeExpanded;
  }

  toggleActions(): void {
    this.actionsExpanded = !this.actionsExpanded;
  }
}
