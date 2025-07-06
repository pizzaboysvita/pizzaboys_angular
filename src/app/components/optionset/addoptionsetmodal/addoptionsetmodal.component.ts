import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { ApisService } from '../../../shared/services/apis.service';
import { AppConstants } from '../../../app.constants';
import Swal from 'sweetalert2';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef, GridReadyEvent } from '@ag-grid-community/core';
interface RowData {
  name:string;
  description:string;
  price:string;
  inStock:string
}
interface OptionItem {
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  hide?: boolean;
  hideOnline?: boolean;
  hidePOS?: boolean;
  hideStandardDish?: boolean;
  hideComboDish?: boolean;
  hidePickup?: boolean;
  hideDelivery?: boolean;
  hideDineIn?: boolean;
  [key: string]: string | number | boolean | undefined;
}

@Component({
  selector: 'app-addoptionsetmodal',
  standalone: true,
  imports: [CommonModule,AgGridAngular, FormsModule, ReactiveFormsModule, NgbNavModule, NgSelectModule],
  templateUrl: './addoptionsetmodal.component.html',
})

export class AddoptionsetmodalComponent {
  @Input() type: any
  @Input() myData: any;

 hideOptionSet = [
    { key: 'always', label: 'Always', checked: false },
    { key: 'pos', label: 'POS', checked: false },
    { key: 'online', label: 'Online Ordering', checked: false },
    { key: 'thirdParty', label: '3rd Party Integration', checked: false }
  ];
  dishTree = [
    {
      name: 'Takeaway Menu',
      checked: false,
      expanded: false,
      children: [
        { name: 'Limited Time Deal', checked: false },
        { name: 'Chicken Wings Special', checked: false },
        { name: 'Deal of the Week', checked: false },
        { name: 'Specials', checked: false },
        { name: 'Lunch', checked: false },
        { name: 'Classic Range Pizzas', checked: false },
        { name: 'Vegetarian Pizzas', checked: false },
        { name: 'Chicken Pizzas', checked: false },
        { name: 'Meat Pizzas', checked: false },
        {
          name: 'Seafood Pizzas',
          checked: false,
          expanded: false,
          children: [
            { name: 'Jamaican Jerk Prawns Pizza (Spicy)', checked: false },
            { name: 'Seafood Supreme', checked: false },
            { name: 'Tropical Caribbean Pizza', checked: false },
            { name: 'Chipotle Prawns Pizza', checked: false },
            { name: 'Creamy Prawns and Bacon Pizza', checked: false },
            { name: 'Garlic Prawns Pizza', checked: false },
            { name: 'Prawn and Bacon Pizza', checked: false },
            { name: 'Salmon and Feta Pizza', checked: false },
            { name: 'Pesto Prawns Pizza', checked: false },
            { name: 'Tuna and Pineapple Pizza', checked: false }
          ]
        },
        { name: 'Standard Sides', checked: false },
        { name: 'Classic Sides', checked: false },
        { name: 'Signature Sides', checked: false },
        { name: 'Premium Sides', checked: false },
        { name: 'Pastas', checked: false },
        { name: "Ben & Jerry's Ice Cream", checked: false },
        { name: 'Dessert', checked: false },
        { name: 'Drinks', checked: false },
        { name: 'Bases', checked: false },
        { name: "Valentine's Day Promotion", checked: false }
      ]
    }
  ];
columnDefs: ColDef<RowData>[]  =  [
  { field: 'name', headerName: 'Name', editable: true },
  { field: 'description', headerName: 'Description', editable: true },
  { field: 'price', headerName: 'Price ($)', editable: true, valueFormatter: (p:any) => Number(p.value).toFixed(2) },
  {
    field: 'inStock',
    headerName: 'In Stock',
    cellRenderer: (p:any) => p.value ? '✔️' : '❌',
    editable: false
  },
{
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
        <div style="display: flex; align-items: center; gap:15px">
          <button class="btn btn-sm p-0" data-action="view" title="View">
            <span class="material-symbols-outlined text-warning">
              visibility
            </span>
          </button>
          <button class="btn btn-sm p-0" data-action="edit" title="Edit">
            <span class="material-symbols-outlined text-success">
              edit
            </span>
          </button>
          <button class="btn btn-sm p-0" data-action="delete" title="Delete">
            <span class="material-symbols-outlined text-danger">
              delete
            </span>
          </button>
        </div>`;
      },
      minWidth: 150,
      flex: 1,
    },
];

  rowData: any[] = []
gridApi: any;
 defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true
  };

onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
 toggleOptionVisibility(opt: OptionItem, key: string) {
    if (typeof opt[key] === 'boolean') {
      opt[key] = !opt[key];
    } else {
      opt[key] = true;
    }
  }

  toggleGlobalHideOption(hideOption: { key: string; label: string; checked: boolean }) {
    hideOption.checked = !hideOption.checked;
  }

  toggleCategory(category: any) {
    console.log(category.checked)
    // if (category.checked) {
      category.children.forEach((child: any) => {
        child.checked = category.checked;
       
      });
 
    // }
  }

  toggleExpand(category: any) {
    
    category.expanded = !category.expanded;
  }
















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

  
    this.posForm = this.fb.group({
      posDispalyname: [''],
      hideMenu: ['']
    })
    // this.buildForm()
   
  }
 
  // buildForm() {
  //   const controlsConfig: { [key: string]: FormControl } = {};
  //   this.surchargeFields.forEach(field => {
  //     controlsConfig[field.controlName] = new FormControl(''); // or provide default value
  //   });

  //   this.surchargeForm = this.fb.group(controlsConfig);

  // }
  ngOnInit() {
    this.patchValue()
    console.log('Received data:', this.myData);
  }
  addNewRow() {
    console.log("new datat")
  const newRow = {
    name: '',
    description: '',
    price: 0.00,
    inStock: true
  };

  this.rowData = [newRow, ...this.rowData];

  // Delay edit to allow grid to render new row
  setTimeout(() => {
    this.gridApi.setFocusedCell(0, 'name');
    this.gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' });
  });
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

    this.apis.postApi(AppConstants.api_end_points.menu, this.reqbody).subscribe((data: any) => {
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
}