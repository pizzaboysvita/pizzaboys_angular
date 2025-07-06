import { Component, Input, OnInit } from "@angular/core";
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
import { AppConstants } from "../../../app.constants";

@Component({
  selector: "app-add-category",
  standalone: true,
  imports: [NgbNavModule, NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.scss"],
})
export class AddCategoryComponent implements OnInit {
  @Input() type:any
  @Input() myData:any
  active = 1;
  menuForm!: FormGroup;
  menuList: any[] = [];
  orderTimesOptions = [
    { id: 'now', name: 'Now' },
    { id: 'Later', name: 'Later' },

  ];

  servicesOptions = [
    { id: 'delivery', name: 'Delivery' },
    { id: 'pickup', name: 'Pickup' },
    { id: 'dine-in', name: 'Dine-in' }
  ];
  storeList: any;

  constructor(
    private fb: FormBuilder,
    public modal: NgbModal,
    private apis: ApisService,
    private session: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getMenuList();
    this.getStoreList()
  
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
      store:['']
    });
    if(this.type =='View'|| this.type =='Edit'){
    this.PatchValuesForm()
    }
  }
  PatchValuesForm()
{
  console.log(this.myData,this.type,'viewwwwwwwwwwwwww')
  this.menuForm.patchValue({
     dish_menu_id: this.myData.dish_menu_id,
      name: this.myData.name,
      display_name: this.myData.display_name,
      description:this.myData.description,
      hide_category: this.myData.hide_category==1?true:false,
      order_times: this.myData.order_times,
      services: [this.myData.servicesOptions],
      // applicable_hours: this.myData.pre_order_cutoff_time,
      mark_as_age_restricted: this.myData.mark_as_age_restricted ==0?false:true,
      enable_pre_orders_only:this.myData.enable_pre_orders_only ==0?false:true,
      pre_order_days_in_advance: this.myData.pre_order_days_in_advance,

      pre_order_cutoff_time: this.myData.pre_order_cutoff_time,
      pre_order_applicable_service: this.myData.pre_order_applicable_service,
      hide_restriction_warning: this.myData.hide_restriction_warning==0?false:true,
      hide_if_unavailable: this.myData.hide_if_unavailable ==0?false:true,
      POS_display_name: this.myData.POS_display_name,
      pos_color_code: this.myData.pos_color_code,
      hide_category_in_POS:this.myData.hide_category_in_POS ==0?false:true,
      pickup_surcharge:this.myData.pickup_surcharge,
      delivery_surcharge:this.myData.delivery_surcharge,
      managed_delivery_surcharge: this.myData.managed_delivery_surcharge,
      dine_in_surcharge: this.myData.dine_in_surcharge,
      status: [1],
      store:[this.myData.store_id]
  })
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
    getStoreList() {
      this.apis.getApi(AppConstants.api_end_points.store_list).subscribe((data: any) => {
        console.log(data)
        data.forEach((element: any) => {
          element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : element.status
        })
        this.storeList = data.reverse()
      })
    }

  addCategory(): void {


  
const reqbody={
    "type": "insert",
    "name": this.menuForm.value.name,
    "dish_menu_id": this.menuForm.value.dish_menu_id,
    "display_name":this.menuForm.value.display_name,
    "description":this.menuForm.value.description,
    "hide_category":this.menuForm.value.hide_category ==true?1:0,
    "order_times": this.menuForm.value.order_times.toString(),
    "services": this.menuForm.value.services.toString(),
    "applicable_hours": "[{\"day\":\"Tue\",\"from\":\"12:00\",\"to\":\"15:00\"}]",
    "mark_as_age_restricted":this.menuForm.value.mark_as_age_restricted ==true?1:0,
    "enable_pre_orders_only":this.menuForm.value.enable_pre_orders_only ==true?1:0,
    "pre_order_days_in_advance": this.menuForm.value.pre_order_days_in_advance,
    "pre_order_cutoff_time": this.menuForm.value.pre_order_cutoff_time,
    "pre_order_applicable_service": this.menuForm.value.pre_order_applicable_service.toString(),
    "hide_restriction_warning": this.menuForm.value.hide_restriction_warning ==true?1:0,
    "hide_if_unavailable": this.menuForm.value.hide_if_unavailable ==true?1:0,
    "POS_display_name": this.menuForm.value.POS_display_name,
    "pos_color_code": "#00AA00",
    "hide_category_in_POS": this.menuForm.value.hide_category_in_POS ==true?1:0,
    "pickup_surcharge": this.menuForm.value.pickup_surcharge,
    "delivery_surcharge": this.menuForm.value.delivery_surcharge,
    "managed_delivery_surcharge": this.menuForm.value.managed_delivery_surcharge,
    "dine_in_surcharge":this.menuForm.value.dine_in_surcharge,
    "store_id": this.menuForm.value.store.toString(),
    "status": 1,
    "created_by": 10,
    "updated_by": 10
}
console.log(reqbody)
    this.apis.postApi("/api/category", reqbody).subscribe((res: any) => {
      if (res.code === "1") {
        alert("Category added successfully");
        this.modal.dismissAll("refresh");
      } else {
        alert(res.message || "Failed to add category");
      }
    });
  }
}
