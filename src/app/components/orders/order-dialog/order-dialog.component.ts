import { CommonModule } from "@angular/common";
import { Component, input, Input } from "@angular/core";
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
  orderDetails:any
  order_items: any;
  orderlogs: any =[];
  constructor(public activeModal: NgbActiveModal, private apis: ApisService) {}

  ngOnInit(): void {
    // Initialization logic here
    this.order_items = JSON.parse(this.data.order_items);
    // console.log(this.datalogs, 'order dialog data');
    // let result1 = this.data.order_master_id.replace("P-", "")
       this.apis.getApi(AppConstants.api_end_points.orderList + '?order_id=' + 24 + '&orderStatus=true&type=web').subscribe((response:any) => {
      console.log(response, 'order details');
      if(response.code ==1){
        this.orderlogs = response.categories;
          //  this.modalRef.componentInstance.datalogs = this.orderDetails;
      }
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
   transform(value: string | Date): string {
    if (!value) return '';
    
    const created = new Date(value).getTime();
    const now = Date.now();
    const diffMs = now - created;

    const diffMin = Math.floor(diffMs / 60000); // ms → minutes
    const diffHr  = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 60) {
      return `${diffMin} min${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHr < 24) {
      return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    }
  }
}
