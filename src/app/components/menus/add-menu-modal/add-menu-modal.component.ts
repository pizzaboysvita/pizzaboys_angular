import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppConstants } from '../../../app.constants';
import { ApisService } from '../../../shared/services/apis.service';
import Swal from 'sweetalert2';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, ITooltipParams, ModuleRegistry } from "@ag-grid-community/core";
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
@Component({
  selector: 'app-add-menu-modal',
  standalone: true,
  imports: [NgbNavModule, NgSelectModule, FormsModule, ReactiveFormsModule,AgGridAngular],
  templateUrl: './add-menu-modal.component.html',
  styleUrls: ['./add-menu-modal.component.scss']
})
export class AddMenuModalComponent {
    modules = [ClientSideRowModelModule];
  @Input() type: any
  @Input() myData: any;
  active = 1;
  menuForm: FormGroup;
  conditionForm: FormGroup;
  posForm!: FormGroup
  surchargeForm: FormGroup
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

  availabilityOptions = [
    { id: 'Breakfast', name: 'Breakfast' },
    { id: 'Lunch', name: 'Lunch' },
    { id: 'Dinner', name: 'Dinner' },
  ];

  surchargeFields = [
    {
      label: 'Pickup Surcharge',
      controlName: 'pickupSurcharge',
      subtext: 'Additional % to apply to item prices for pickup sales'
    },
    {
      label: 'Delivery Surcharge',
      controlName: 'deliverySurcharge',
      subtext: 'Additional % to apply to item prices for delivery sales'
    },
    {
      label: 'Managed Delivery Surcharge',
      controlName: 'managedDeliverySurcharge',
      subtext: 'Additional % to apply to item prices for managed delivery sales where we supply drivers'
    },
    {
      label: 'Dine-In Surcharge',
      controlName: 'dineInSurcharge',
      subtext: 'Additional % to apply to item prices for dine-in sales'
    }
  ];

  orderTimesOptions = [
    { id: 'now', name: 'Now' },
    { id: 'Later', name: 'Later' },

  ];

  servicesOptions = [
    { id: 'delivery', name: 'Delivery' },
    { id: 'pickup', name: 'Pickup' },
    { id: 'dine-in', name: 'Dine-in' }
  ];

  preOrderServicesOptions = [
    { id: 'delivery', name: 'Delivery' },
    { id: 'pickup', name: 'Pickup' }
  ];
  storeList: any;
  reqbody:any
  file: File;
  uploadImagUrl: string | ArrayBuffer | null;
  uploadImagUrl2: string | ArrayBuffer | null;
  constructor(private fb: FormBuilder, public modal: NgbModal, private apis: ApisService,private toastr: ToastrService,private sessionStorageService:SessionStorageService ) {
    this.menuForm = this.fb.group({
      name: ['',Validators.required],
      displayName: [''],
      description: [''],
      disableDishNotes: [false],
      restockMenuDaily: [false],
      hideMenu: [false],
      availability: [[]],
      posName: [''],
      surcharge: [''],
      image:[null,Validators.required]
    });

    this.conditionForm = this.fb.group({
      orderTimes: [null],
      services: [''],
      store: [''],
      preOrderServices: [''],
      ageRestricted: [false],
      preOrderOnly: [false],
      preOrderDays: [0],
      preOrderCutoffTime: ['00:00'],
      hideRestrictionWarning: [false],
      hideIfUnavailable: [false]
    });
    this.posForm = this.fb.group({
      posDispalyname: [''],
      hideMenu: ['']
    })
    this.buildForm()
    this.getStoreList()
  }
  getStoreList() {
    this.apis.getApi(AppConstants.api_end_points.store_list).subscribe((data: any) => {
      console.log(data)
       
      data.forEach((element: any) => {

        element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : element.status
      })
      this.storeList = data
    })
  }
  buildForm() {
    const controlsConfig: { [key: string]: FormControl } = {};
    this.surchargeFields.forEach(field => {
      controlsConfig[field.controlName] = new FormControl(''); // or provide default value
    });

    this.surchargeForm = this.fb.group(controlsConfig);

  }
  ngOnInit() {
    this.patchValue()
    console.log('Received data:', this.myData);
  }
  patchValue() {
    console.log(this.myData, this.type, 'opennnnnnnnnnnnn')
    if (this.type == 'Edit' || this.type == 'View') {
       this.menuForm.get('image')?.clearValidators();
      this.menuForm.get('image')?.updateValueAndValidity();
      this.menuForm.patchValue({

        name: this.myData.name,
        displayName: this.myData.display_name,
        description: this.myData.description,
        disableDishNotes: this.myData.disable_dish_notes == 1 ? true : this.myData.disable_dish_notes == 0 ? false : '',
        restockMenuDaily: this.myData.re_stock_menu_daily == 1 ? true : this.myData.re_stock_menu_daily == 0 ? false : '',
        hideMenu: this.myData.hide_menu == 1 ? true : this.myData.hide_menu == 0 ? false : '',
        availability: [[]],
        posName: [''],
        surcharge: [''],

      })
      this.conditionForm.patchValue({
        store:[this.myData.store_id],
          services: this.myData.services !=null?this.myData.services.split(','):[],
        orderTimes: this.myData.order_times,
      
        ageRestricted: this.myData.mark_as_age_restricted ==0?false:this.myData.mark_as_age_restricted ==1? true:'',
        preOrderOnly: this.myData.enable_pre_orders_only ==0?false:this.myData.enable_pre_orders_only ==1?true:'',
        preOrderDays: this.myData.pre_order_days_in_advance,
        preOrderCutoffTime: this.myData.pre_order_cutoff_time,
        preOrderServices: this.myData.pre_order_applicable_service !=null?this.myData.pre_order_applicable_service.split(","):[],
        hideRestrictionWarning: this.myData.hide_restriction_warning == 0 ? false : this.myData.hide_restriction_warning == 1 ? true : '',
        hideIfUnavailable: this.myData.hide_if_unavailable == 0 ? false : this.myData.hide_if_unavailable == 1 ? true : '',
      })
      this.posForm.patchValue({
        posDispalyname:this.myData.POS_display_name,
        hideMenu:this.myData.hide_menu_in_POS ==0?false:this.myData.hide_menu_in_POS ==1?true:'',
      })
       this.surchargeForm.patchValue({
        pickupSurcharge:this.myData.pickup_surcharge,
        deliverySurcharge:this.myData.delivery_surcharge,
        managedDeliverySurcharge:this.myData.managed_delivery_surcharge,
        dineInSurcharge:this.myData.dine_in_surcharge,
       })
        this.uploadImagUrl = this.myData.menu_image
    }
  }

  saveMenu() {
    
    console.log('Saving menu', this.menuForm.value,this.conditionForm.getRawValue().store);
       if (this.menuForm.invalid || this.conditionForm.invalid) {
      Object.keys(this.menuForm.controls).forEach(key => {
        this.menuForm.get(key)?.markAsTouched();
            this.toastr.error('All required fields must be filled.', 'Error');
      });
        Object.keys(this.conditionForm.controls).forEach(key => {
        this.conditionForm.get(key)?.markAsTouched();
      });
      // this.showToast('error', 'Validation Error', 'Please fill required fields correctly.');
      // this.messageService.add({ 'error', 'Validation Error','Please fill required fields correctly.'});
      return;
    }else{
    if(this.type =='Edit'){
 this.reqbody = {
      "type": "update",
        "menu_id":this.myData.dish_menu_id,
      "name": this.menuForm.value.name ,
      "display_name": this.menuForm.value.displayName,
      "description": this.menuForm.value.description,
      "disable_dish_notes": this.menuForm.value.disableDishNotes == true ? 1 : 0,
      "re_stock_menu_daily": this.menuForm.value.restockMenuDaily == true ? 1 : 0,
      "hide_menu": this.menuForm.value.hideMenu == true ? 0 : 1,
      "order_times": this.conditionForm.value.orderTimes == null ? '' : this.conditionForm.value.orderTimes.toString(),
      "services": this.conditionForm.value.services.toString(),
      "applicable_hours": "[{\"day\":\"Mon\",\"from\":\"12:00\",\"to\":\"15:00\"}]",
      "mark_as_age_restricted": this.conditionForm.value.ageRestricted == true ? 1 : 0,
      "enable_pre_orders_only": this.conditionForm.value.preOrderOnly == true ? 1 : 0,
      "pre_order_days_in_advance": this.conditionForm.value.preOrderDays,
      "pre_order_cutoff_time": this.conditionForm.value.preOrderCutoffTime,
      "pre_order_applicable_service": this.conditionForm.value.preOrderServices.toString(),
      "hide_restriction_warning": this.conditionForm.value.hideRestrictionWarning == true ? 1 : 0,
      "hide_if_unavailable": this.conditionForm.value.hideIfUnavailable == true ? 1 : 0,
      "POS_display_name": this.posForm.value.posDispalyname,
      "hide_menu_in_POS": this.posForm.value.hideMenu == true ? 0 : 1,
      "pickup_surcharge": this.surchargeForm.value.pickupSurcharge,
      "delivery_surcharge": this.surchargeForm.value.deliverySurcharge,
      "managed_delivery_surcharge": this.surchargeForm.value.managedDeliverySurcharge,
      "dine_in_surcharge": this.surchargeForm.value.dineInSurcharge,
      "store_id":this.conditionForm.getRawValue().store.toString(),
      menu_image: this.uploadImagUrl,
      "created_by": JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.user_id,
    }
  }else{
  
    this.reqbody = {
      "type": "insert",
      "name": this.menuForm.value.name,
      "display_name": this.menuForm.value.displayName ==''?'': this.menuForm.value.displayName,
      "description": this.menuForm.value.description ==''?'':this.menuForm.value.description,
      "disable_dish_notes": this.menuForm.value.disableDishNotes == true ? 1 : 0,
      "re_stock_menu_daily": this.menuForm.value.restockMenuDaily == true ? 1 : 0,
      "hide_menu": this.menuForm.value.hideMenu == true ? 0 : 1,
      "order_times": (this.conditionForm.value.orderTimes =='' ||this.conditionForm.value.orderTimes ==null) ?null:this.conditionForm.value.orderTimes.toString(),
      "services": this.conditionForm.value.services==''?null: this.conditionForm.value.services.toString(),
      "applicable_hours":this.rowData.length ==0?'':JSON.stringify(this.rowData),
      "mark_as_age_restricted": this.conditionForm.value.ageRestricted == true ? 1 : 0,
      "enable_pre_orders_only": this.conditionForm.value.preOrderOnly == true ? 1 : 0,
      "pre_order_days_in_advance": this.conditionForm.value.preOrderDays ==''?null:this.conditionForm.value.preOrderDays,
      "pre_order_cutoff_time": this.conditionForm.value.preOrderCutoffTime ==''?null:this.conditionForm.value.preOrderDays,
      "pre_order_applicable_service": this.conditionForm.value.preOrderServices==''?null: this.conditionForm.value.preOrderServices.toString(),
      "hide_restriction_warning": this.conditionForm.value.hideRestrictionWarning == true ? 1 : 0,
      "hide_if_unavailable": this.conditionForm.value.hideIfUnavailable == true ? 1 : 0,
      "POS_display_name": this.posForm.value.posDispalyname ==''?'':this.posForm.value.posDispalyname,
      "hide_menu_in_POS": this.posForm.value.hideMenu == true ? 0 : 1,
      "pickup_surcharge": this.surchargeForm.value.pickupSurcharge ==''?0.0:this.surchargeForm.value.pickupSurcharge,
      "delivery_surcharge": this.surchargeForm.value.deliverySurcharge ==''?0.0:this.surchargeForm.value.deliverySurcharge,
      "managed_delivery_surcharge": this.surchargeForm.value.managedDeliverySurcharge ==''?0.0: this.surchargeForm.value.managedDeliverySurcharge,
      "dine_in_surcharge": this.surchargeForm.value.dineInSurcharge ==''?0.0:this.surchargeForm.value.dineInSurcharge,
      "store_id": this.conditionForm.value.store.length ==0?this.storeList.map((item:any)=>item.store_id):this.conditionForm.value.store,
      "created_by":  JSON.parse(this.sessionStorageService.getsessionStorage('loginDetails') as any).user.user_id,
    }
  }
  
    console.log(this.reqbody)
   const formData = new FormData();
    formData.append("image", this.file); // Attach Blob with a filename
    formData.append("body", JSON.stringify(this.reqbody));
    this.apis.postApi(AppConstants.api_end_points.menuV2, formData).subscribe((data: any) => {
      console.log(data)
      if (data.code == 1) {
        console.log(data)
        Swal.fire('Success!', data.message, 'success').then(
          (result) => {
            if (result) {
              console.log('User clicked OK');
              // this.router.navigate(['/restaurants/restaurants-list'])
              this.modal.dismissAll();

            }
          })
      }


    })
  }
  }
  addTimeSlot() {
    console.log('Add Time Slot clicked');
    alert('Add Time Slot clicked (you can open a modal or dialog here)');
  }
   onSelectFile(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    console.log(input.files[0])
    this.file = input.files[0];
    console.log()
     this.menuForm.get('image')?.setValue(this.file);
    const reader = new FileReader();

    reader.onload = () => {
      this.uploadImagUrl2 = reader.result; // this will update the image source
    };

    reader.readAsDataURL(this.file); // convert image to base64 URL
  }
}
 formatTime(params: any) {
    return params.value;
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
removeImage(){
    this.uploadImagUrl = null;
    this.uploadImagUrl2 = null;
    this.menuForm.get('image')?.setValue(null);
    // this.file = null;
}
}
