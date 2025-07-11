import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppConstants } from '../../../app.constants';
import { ApisService } from '../../../shared/services/apis.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-menu-modal',
  standalone: true,
  imports: [NgbNavModule, NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-menu-modal.component.html',
  styleUrls: ['./add-menu-modal.component.scss']
})
export class AddMenuModalComponent {
  @Input() type: any
  @Input() myData: any;
  active = 1;
  menuForm: FormGroup;
  conditionForm: FormGroup;
  posForm!: FormGroup
  surchargeForm: FormGroup
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
  constructor(private fb: FormBuilder, public modal: NgbModal, private apis: ApisService) {
    this.menuForm = this.fb.group({
      name: [''],
      displayName: [''],
      description: [''],
      disableDishNotes: [false],
      restockMenuDaily: [false],
      hideMenu: [false],
      availability: [[]],
      posName: [''],
      surcharge: [''],
    });

    this.conditionForm = this.fb.group({
      orderTimes: [''],
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
      this.storeList = data.reverse()
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
          services: this.myData.services.split(','),
        orderTimes: this.myData.order_times,
      
        ageRestricted: this.myData.mark_as_age_restricted ==0?false:this.myData.mark_as_age_restricted ==1? true:'',
        preOrderOnly: this.myData.enable_pre_orders_only ==0?false:this.myData.enable_pre_orders_only ==1?true:'',
        preOrderDays: this.myData.pre_order_days_in_advance,
        preOrderCutoffTime: this.myData.pre_order_cutoff_time,
        preOrderServices: this.myData.pre_order_applicable_service.split(","),
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
    }
  }

  saveMenu() {
    console.log('Saving menu', this.menuForm.value);
    if(this.type =='Edit'){
 this.reqbody = {
      "type": "update",
        "menu_id":this.myData.dish_menu_id,
      "name": this.menuForm.value.name,
      "display_name": this.menuForm.value.displayName,
      "description": this.menuForm.value.description,
      "disable_dish_notes": this.menuForm.value.disableDishNotes == true ? 1 : 0,
      "re_stock_menu_daily": this.menuForm.value.restockMenuDaily == true ? 1 : 0,
      "hide_menu": this.menuForm.value.hideMenu == true ? 1 : 0,
      "order_times": this.conditionForm.value.orderTimes.toString(),
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
      "hide_menu_in_POS": this.posForm.value.hideMenu == true ? 1 : 0,
      "pickup_surcharge": this.surchargeForm.value.pickupSurcharge,
      "delivery_surcharge": this.surchargeForm.value.deliverySurcharge,
      "managed_delivery_surcharge": this.surchargeForm.value.managedDeliverySurcharge,
      "dine_in_surcharge": this.surchargeForm.value.dineInSurcharge,
      "store_id": this.conditionForm.value.store.toString(),
      "created_by": 1
    }
  }else{
    this.reqbody = {
      "type": "insert",
      "name": this.menuForm.value.name,
      "display_name": this.menuForm.value.displayName,
      "description": this.menuForm.value.description,
      "disable_dish_notes": this.menuForm.value.disableDishNotes == true ? 1 : 0,
      "re_stock_menu_daily": this.menuForm.value.restockMenuDaily == true ? 1 : 0,
      "hide_menu": this.menuForm.value.hideMenu == true ? 1 : 0,
      "order_times": this.conditionForm.value.orderTimes.toString(),
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
      "hide_menu_in_POS": this.posForm.value.hideMenu == true ? 1 : 0,
      "pickup_surcharge": this.surchargeForm.value.pickupSurcharge,
      "delivery_surcharge": this.surchargeForm.value.deliverySurcharge,
      "managed_delivery_surcharge": this.surchargeForm.value.managedDeliverySurcharge,
      "dine_in_surcharge": this.surchargeForm.value.dineInSurcharge,
      "store_id": this.conditionForm.value.store.toString(),
      "created_by": 1
    }
  }
    console.log(this.reqbody)
   const formData = new FormData();
    formData.append("image", this.file); // Attach Blob with a filename
    formData.append("body", JSON.stringify(this.reqbody));
    this.apis.postApi(AppConstants.api_end_points.menu, formData).subscribe((data: any) => {
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
    const reader = new FileReader();

    reader.onload = () => {
      this.uploadImagUrl = reader.result; // this will update the image source
    };

    reader.readAsDataURL(this.file); // convert image to base64 URL
  }
}
}
