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
import Swal from "sweetalert2";
import { ColDef, ITooltipParams, ModuleRegistry } from "@ag-grid-community/core";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ToastrService } from "ngx-toastr";
ModuleRegistry.registerModules([ClientSideRowModelModule]);
@Component({
  selector: "app-add-category",
  standalone: true,
  imports: [NgbNavModule, NgSelectModule, FormsModule, ReactiveFormsModule,AgGridAngular],
  templateUrl: "./add-category.component.html",
  styleUrls: ["./add-category.component.scss"],
})
export class AddCategoryComponent implements OnInit {
    modules = [ClientSideRowModelModule];
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
    rowData :any= [];
isHide=false
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  columnDefs :any= [
    {
      headerName: 'Day',
      field: 'day',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.days
      }
    },
    {
    headerName: 'Open',
    field: 'open',
    editable: (params: any) => !params.data.is24Hour
  },
  {
    headerName: 'Close',
    field: 'close',
    editable: (params: any) => !params.data.is24Hour
  },
    {
  headerName: '24 Hours',
  field: 'is24Hour',
  cellRenderer: (params: any) => {
    const checked = params.value ? 'checked' : '';
    return `
      <div class="d-flex align-items-center justify-content-center gap-2">
        <input type="checkbox" class="checkbox-24hr" ${checked} data-row="${params.rowIndex}" />
        <button class="btn btn-sm btn-outline-danger delete-btn" data-row="${params.rowIndex}">🗑</button>
        
        <button class="btn btn-sm btn-outline-secondary copy-btn" data-row="${params.rowIndex}">📄</button>
      </div>
    `;
  },
  onCellClicked: (params: any) => {
    const target = params.event.target as HTMLElement;
    const rowIndex = params.node.rowIndex;

    if (target.classList.contains('delete-btn')) {
      params.api.applyTransaction({ remove: [params.node.data] });
    }

    if (target.classList.contains('copy-btn')) {
      const copy = { ...params.node.data };
      params.api.applyTransaction({ add: [copy], addIndex: rowIndex + 1 });
    }

    if (target.classList.contains('checkbox-24hr')) {
      const checked = (target as HTMLInputElement).checked;
      params.node.setDataValue('is24Hour', checked);

      // Force Open/Close cells to update editable status
      params.api.refreshCells({
        rowNodes: [params.node],
        force: true,
        columns: ['open', 'close']
      });
    }
  },
  minWidth: 150,
  flex: 1
}

    
  ];

  storeList: any;
  uploadImagUrl: string | ArrayBuffer | null;
  file: File;
  reqbody: any

  constructor(
    private fb: FormBuilder,
    public modal: NgbModal,
    private apis: ApisService,private toastr: ToastrService, 
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
       image: [null, Validators.required],
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
      store:['',Validators.required]
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

  if (this.menuForm.invalid) {
      console.log('validation required fields');
      const controls = this.menuForm.controls;
      Object.keys(controls).forEach(key => {
        controls[key].markAsTouched();
      });
       this.toastr.error('All required fields must be filled.', 'Error');

        // this.menuForm.markAllAsTouched(); 
    } else {
  if( this.type == 'Edit') {
 this.reqbody={
    "type": "update",
    "id": this.myData.id,
    "name": this.menuForm.value.name,
    "dish_menu_id": this.menuForm.value.dish_menu_id,
    "display_name":this.menuForm.value.display_name,
    "description":this.menuForm.value.description,
    "hide_category":this.menuForm.value.hide_category ==true?1:0,
    "order_times": this.menuForm.value.order_times.toString(),
    "services": this.menuForm.value.services.toString(),
    "applicable_hours":this.rowData.length ==0?"":JSON.stringify(this.rowData),
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
    "created_by": 1,
    "updated_by": 1
}
  }else{
    this.reqbody={
    "type": "insert",
    "name": this.menuForm.value.name,
    "dish_menu_id": this.menuForm.value.dish_menu_id,
    "display_name":this.menuForm.value.display_name,
    "description":this.menuForm.value.description,
    "hide_category":this.menuForm.value.hide_category ==true?1:0,
    "order_times": this.menuForm.value.order_times.toString(),
    "services": this.menuForm.value.services.toString(),
    "applicable_hours":this.rowData.length ==0?"":JSON.stringify(this.rowData),
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
  }
console.log(this.reqbody)
    const formData = new FormData();
    formData.append("image", this.file); // Attach Blob with a filename
    formData.append("body", JSON.stringify(this.reqbody));
    this.apis.postApi("/api/category", formData).subscribe((res: any) => {
      if (res.code === "1") {
    
    Swal.fire('Success!', res.message, 'success').then(
            (result) => {
              if (result) {
                console.log('User clicked OK');
                // this.router.navigate(['/restaurants/restaurants-list'])
                this.modal.dismissAll();
  
              }
            })
      } else {
        alert(res.message || "Failed to add category");
      }
    });
  }
  }
//      onSelectFile(event: Event): void {
//   const input = event.target as HTMLInputElement;

//   if (input.files && input.files[0]) {
//     console.log(input.files[0])
//     this.file = input.files[0];
//    this.menuForm.get('image')?.setValue(this.file);
//   }
// }
selectedFile: File | null = null;
previewUrl: string | ArrayBuffer | null = null;
onSelectFile(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.selectedFile = file;
  this.file = file;
    // Manually update form value (not bound to input)
    this.menuForm.get('image')?.setValue(file);
    this.menuForm.get('image')?.markAsTouched();

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
 

removeImage(): void {
  this.previewUrl = null;
    this.selectedFile = null;
  this.menuForm.get('image')?.reset();  // Reset form control
}

onCellClicked(params: any) {
    const rowIndex = params.rowIndex;
    const actionTarget = params.event.target as HTMLElement;

    if (actionTarget.classList.contains('delete-btn')) {
      console.log(rowIndex)
      this.rowData.splice(rowIndex, 1);
      // this.rowData = [...this.rowData];
    }

    // if (actionTarget.classList.contains('copy-btn')) {
    //   const copiedRow = { ...this.rowData[rowIndex] };
    //   this.rowData.splice(rowIndex + 1, 0, copiedRow);
    //   this.rowData = [...this.rowData];
    // }
  }

addNewRow() {
  console.log(this.rowData, ' this.rowData');
  this.isHide =true
  this.rowData.push({ day: 'Monday', open: '09:00', close: '21:00', is24Hour: false });
  this.rowData = [...this.rowData]; // forces change detection
}
}
