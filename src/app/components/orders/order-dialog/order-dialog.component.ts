import { CommonModule } from "@angular/common";
import { Component, input, Input } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap"; 
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-order-dialog",
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: "./order-dialog.component.html",
  styleUrl: "./order-dialog.component.scss",
})
export class OrderDialogComponent {
  @Input() data: any;
 // component.ts
statuses = ["Confirmed", "Ready", "Completed", "Delivered"];  

currentStatus:any // <-- backend API or dynamic status

  activeTab = "details";
  statusExpanded = false;
  readyTimeExpanded = false;
  actionsExpanded = false;
  statusList: any[] = [
    { id: 'Change Status', name: "Change Status" },
    { id: 'Cancelled', name: "Cancelled" },
    { id: 'Un-Confirmed', name: "Un-Confirmed" },
    { id: 'Confirmed', name: "Confirmed" },
    { id: 'Ready', name: "Ready" },
    { id: 'Completed', name: "Completed" },
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
  order_toppings: any;
  order_ingredients: any;
  totalOrdermerged:any
  orderForm:FormGroup
  orderDishDetails:any=[]
  constructor(public modal: NgbModal,private toastr: ToastrService,private session:SessionStorageService,private apis: ApisService,private fb:FormBuilder) {}

  ngOnInit(): void {
    this.orderDishDetails=JSON.parse(this.data.combo_details_json)
    console.log(this.orderDishDetails,'oppppppppp')
    this.currentStatus=this.data.order_status
    this.orderForm =this.fb.group({
      status:[this.data.order_status],
      modifyEstTime:[''],
      action:['']
    })
       this.apis.getApi(AppConstants.api_end_points.orderList + '?order_id=' + this.data.order_master_id + '&orderStatus=true&type=web').subscribe((response:any) => {
      console.log(response, 'order details');
      if(response.code ==1){
        this.orderlogs = response.categories;
          //  this.modalRef.componentInstance.datalogs = this.orderDetails;
      }
    });
    // Initialization logic here
    console.log(this.data,'this.datathis.datathis.datathis.datathis.datathis.datathis.datathis.data')

 this.order_items = JSON.parse(this.data.order_items);
       this.order_toppings = JSON.parse(this.data.order_toppings);
          this.order_ingredients = JSON.parse(this.data.order_ingredients);
    this.totalOrdermerged = this.order_items.map((dish:any) => {
  const selected =  this.order_toppings
    .filter((opt:any) => opt.dish_id === dish.dish_id)
    .map(({ name, price,quantity }:any ) => ({ name, price,quantity }));

     const ingredients =  this.order_ingredients
    .filter((opt:any) => opt.dish_id === dish.dish_id)
    .map(({ name, price,quantity }:any ) => ({ name, price,quantity }));

  return { ...dish, selected_options: [...selected,...ingredients] };
});
   
    console.log(this.totalOrdermerged ,this.order_toppings,'order dialog data');
    // let result1 = this.data.order_master_id.replace("P-", "")
    
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
  updatedOrder(){
    const reqbody={
  "order_id": this.data.order_master_id,
  "order_status": this.orderForm.value.status,
  "updated_by":  JSON.parse(this.session.getsessionStorage('loginDetails') as any).user.user_id
}
this.apis.putApi(AppConstants.api_end_points.orderList,reqbody).subscribe((data:any)=>{
      if (data && data.code == 1) {
         Swal.fire('Success!',data.message, 'success').then(
              (result) => {
          if (result) {
                    this.modal.dismissAll();
          }}
             );

      }
      else{
             Swal.fire('Success!',data.message, 'success').then(
              (result) => {
          if (result) {
                    this.modal.dismissAll();

          
          }}
             );
      }
    })
        
     
    
 

  }
  // component.ts
getStepClass(step: string) {
  const currentIndex = this.statuses.indexOf(this.currentStatus);
  const stepIndex = this.statuses.indexOf(step);

  if (stepIndex <= currentIndex) {
    return "progtrckr-done";   // completed step
  } else {
    return "progtrckr-todo";   // pending step
  }
}

}
