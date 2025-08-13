import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
interface RowData {
  name: string;
  description: string;
  status: string;
  price: string;
  inStock: string
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
  imports: [CommonModule, AgGridAngular, FormsModule, ReactiveFormsModule, NgbNavModule, NgSelectModule],
  templateUrl: './addoptionsetmodal.component.html',
})

export class AddoptionsetmodalComponent {
  @Input() type: any
  @Input() myData: any;
  choices: any[] = [];
  currentMenuIndex = 0;
  rawMenus: any[] = [];
  addedMenuIds: Set<number> = new Set();

  optionSetConditionForm: FormGroup
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
  columnDefs: ColDef<RowData>[] = [
    { field: 'name', headerName: 'Name', editable: true },
    { field: 'description', headerName: 'Description', editable: true },
    { field: 'price', headerName: 'Price ($)', width: 20, editable: true, valueFormatter: (p: any) => Number(p.value).toFixed(2) },
    {
      field: 'inStock',
      headerName: 'In Stock',
      width: 200,
      editable: false,
      cellRenderer: (params: any) => {
        const icon = params.value ? '✔️' : '❌';
        return `<span style="cursor:pointer;" class="toggle-instock">${icon}</span>`;
      },
      onCellClicked: (params: any) => {
        if (params.colDef.field === 'inStock') {
          params.node.setDataValue('inStock', !params.value);
        }
      }
    },

    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        const select = document.createElement('select');
        select.className = 'custom-select';


        const options = ['Active', 'Hide', 'Hide Online', 'Hide POS'];
        const selected = params.value || '';

        options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt;
          option.text = opt;
          if (opt === selected) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        const rowData = params.data;
        // Handle the change event
        select.addEventListener('change', (event) => {
          const newValue = (event.target as HTMLSelectElement).value;
          params.setValue(newValue); // Updates the grid's value
          console.log('Dropdown changed to:', newValue);
          console.log(rowData, 'rowData')
        });

        return select;
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
        <div style="display: flex; align-items: center; gap:15px">
         
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

  toggleOptions = [
    { key: 'editing', label: 'Hide Editing Mode', enabled: false },
    { key: 'hide', label: 'Hide', enabled: true },
    { key: 'online', label: 'Hide Online', enabled: true },
    { key: 'pos', label: 'Hide POS', enabled: true },
    { key: 'std', label: 'Hide Standard Dish', enabled: true },
    { key: 'combo', label: 'Hide Combo Dish', enabled: true },
    { key: 'pickup', label: 'Hide Pickup', enabled: true },
    { key: 'delivery', label: 'Hide Delivery', enabled: true },
    { key: 'dinein', label: 'Hide Dine-In', enabled: true }
  ];


  active = 1;
  optionSetForm: FormGroup;
  miscForm: FormGroup
  storeList: any;
  reqbody: any
  constructor(private fb: FormBuilder, public modal: NgbModal,private toastr: ToastrService, private apis: ApisService, private sessionStorage: SessionStorageService) {
    this.optionSetForm = this.fb.group({
      name: ['',Validators.required],
      displayName: [''],
      description: [''],
      disableDishNotes: [false],
      restockMenuDaily: [false],
      hideMenu: [false],
      availability: [[]],
      posName: [''],
      surcharge: [''],

    });
    this.optionSetConditionForm = this.fb.group({
      required: [''],
      SelectMultiple: [''],
      enableOptionQuantity: [''],
      MinOptionsRequired: [''],
      MaxOptionsAllowed: [''],
      FreeQuantity: ['']
    })

    this.miscForm = this.fb.group({
      PriceinFreeQuantityPromos: ['']
    })
  }

  ngOnInit() {
    this.getMenuCategoryDishData();
    this.patchValue();
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
    setTimeout(() => {
      this.gridApi.setFocusedCell(0, 'name');
      this.gridApi.startEditingCell({ rowIndex: 0, colKey: 'name' });
    });
  }
  getMenuCategoryDishData() {
    const userId = JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id;

    const menuApi = this.apis.getApi(AppConstants.api_end_points.menu + '?user_id=' + userId);
    const categoryApi = this.apis.getApi(`/api/category?user_id=` + userId);
    const dishApi = this.apis.getApi(AppConstants.api_end_points.dish + '?user_id=' + userId);

    forkJoin([menuApi, categoryApi, dishApi]).subscribe(
      ([menuRes, categoryRes, dishRes]: any) => {
        const resi = this.apis.buildMenuTree(menuRes.data, categoryRes.categories, dishRes.data)
        this.rawMenus = resi
        const builtChoices = this.rawMenus.map(menu => ({
          menuId: menu.menuId,
          name: menu.menuName,
          expanded: false,
          checked: false,             // for main menu toggle
          takeawayExpanded: false,       // for category toggle
          subcategories: menu.categories.map((category: { categoryName: any; dishes: any[]; }) => ({
            name: category.categoryName,
            checked: false,
            expanded: false,             // for subcategory toggle
            subSubcategories: category.dishes?.map(dish => ({
              name: dish.dishName,
              checked: false,
              image_url: dish.image_url
            })) || []
          }))
        }));
        console.log(resi, "resi");
        // Load saved checked/expanded state from myData
        let savedChoices: any[] = [];
        const jsonString = this.myData?.option_set_dishes;
        if (this.type == 'Edit' || this.type == 'View') {
          if (jsonString) {
            savedChoices = JSON.parse(jsonString);
          }
        }

        // Merge state
        this.choices = this.mergeChoiceStates(builtChoices, savedChoices);

        // this.selectedMenuId=this.menuList[0]

        // this.totalcategoryList=categoryRes.categories
        // this.totalDishList=dishRes.data
        // this.menuType_cat(this.menuList[0])
        // this.totalmenuDetails=this.apiService.buildMenuTree(menuRes.data,categoryRes.categories,dishRes.data)
        // console.log(this.totalmenuDetails)

      })
  }
  mergeChoiceStates(apiChoices: any[], savedChoices: any[]) {
    return apiChoices.map(apiChoice => {
      const saved = savedChoices.find((sc: any) => sc.menuId === apiChoice.menuId);
      if (!saved) return apiChoice;

      return {
        ...apiChoice,
        checked: saved.checked,
        takeawayExpanded: saved.takeawayExpanded,
        subcategories: apiChoice.subcategories.map((sub: { name: any; subSubcategories: any[]; }) => {
          const savedSub = saved.subcategories?.find((ss: any) => ss.name === sub.name);
          return {
            ...sub,
            checked: savedSub?.checked ?? false,
            expanded: savedSub?.expanded ?? false,
            subSubcategories: sub.subSubcategories.map(subsub => {
              const savedSubSub = savedSub?.subSubcategories?.find((sss: any) => sss.name === subsub.name);
              return {
                ...subsub,
                checked: savedSubSub?.checked ?? false
              };
            })
          };
        })
      };
    });
  }
onCellValueChanged(event: any) {
  console.log('Updated description:', event.data.description);
}
  addChoice() {
    const nextMenu = this.rawMenus.find(menu => !this.addedMenuIds.has(menu.menuId));
    if (!nextMenu) {
      console.warn("No more menus to add.");
      return;
    }

    const newChoice = {
      menuId: nextMenu.menuId,
      name: nextMenu.menuName,
      checked: false,
      expanded: false,
      takeawayExpanded: false,
      subcategories: nextMenu.categories.map((category: { categoryName: any; dishes: any[]; }) => ({
        name: category.categoryName,
        checked: false,
        expanded: false,
        subSubcategories: category.dishes?.map(dish => ({
          name: dish.dishName,
          checked: false,
          image_url: dish.image_url
        })) || []
      }))
    };

    this.choices.push(newChoice);
    this.addedMenuIds.add(nextMenu.menuId);
  }

  onChoiceToggle(choice: any) {
    const isChecked = choice.checked;

    for (let sub of choice.subcategories) {
      sub.checked = isChecked;

      if (sub.subSubcategories && sub.subSubcategories.length > 0) {
        for (let subsub of sub.subSubcategories) {
          subsub.checked = isChecked;
        }
      }
    }
  }
  onSubcategoryToggle(sub: any) {
    const isChecked = sub.checked;

    if (sub.subSubcategories && sub.subSubcategories.length > 0) {
      for (let subsub of sub.subSubcategories) {
        subsub.checked = isChecked;
      }
    }
  }

  toggleExpand(index: number) {
    this.choices[index].expanded = !this.choices[index].expanded;
  }

  // removeChoice(index: number) {
  //   this.choices.splice(index, 1);
  // }
  removeChoice(index: number) {
    const removedMenuId = this.choices[index].menuId;
    this.choices.splice(index, 1);
    this.addedMenuIds.delete(removedMenuId);  // Allow it to be added again
  }

  saveMenu() {
    console.log('Saving menu', this.rowData, this.hideOptionSet);
    if (this.type == 'Edit') {
      this.reqbody = {
        "type": "update",
        'option_set_id': this.myData?.option_set_id,
        "option_set_name": this.optionSetForm.value.name,
        "dispaly_name": this.optionSetForm.value.displayName,
        "hide_name": this.optionSetForm.value.hideMenu == false ? 0 : 1,
        "hide_option_set": JSON.stringify(this.hideOptionSet),
        "option_set_combo": JSON.stringify(this.rowData),
        "required": this.optionSetConditionForm.value.required == true ? 1 : 0,
        "hide_opion_set_json": JSON.stringify(this.hideOptionSet),
        "select_multiple": this.optionSetConditionForm.value.SelectMultiple == true ? 1 : 0,
        "enable_option_quantity": this.optionSetConditionForm.value.enableOptionQuantity = true ? 1 : 0,
        "min_option_quantity": this.optionSetConditionForm.value.MinOptionsRequired,
        "max_option_allowed": this.optionSetConditionForm.value.MaxOptionsAllowed,
        "free_quantity": this.optionSetConditionForm.value.FreeQuantity,
        "option_set_dishes": JSON.stringify(this.choices),
        "inc_price_in_free": this.miscForm.value.PriceinFreeQuantityPromos = true ? 1 : 0,
        "cretaed_by": 1011
      }
    }
    else {
      this.reqbody = {
        "type": "insert",
        "option_set_name": this.optionSetForm.value.name,
        "dispaly_name": this.optionSetForm.value.displayName,
        "hide_name": this.optionSetForm.value.hideMenu == false ? 0 : 1,
        "hide_option_set": JSON.stringify(this.hideOptionSet),
        "option_set_combo": JSON.stringify(this.rowData),
        "required": this.optionSetConditionForm.value.required == true ? 1 : 0,
        "hide_opion_set_json": JSON.stringify(this.hideOptionSet),
        "select_multiple": this.optionSetConditionForm.value.SelectMultiple == true ? 1 : 0,
        "enable_option_quantity": this.optionSetConditionForm.value.enableOptionQuantity = true ? 1 : 0,
        "min_option_quantity": this.optionSetConditionForm.value.MinOptionsRequired,
        "max_option_allowed": this.optionSetConditionForm.value.MaxOptionsAllowed,
        "free_quantity": this.optionSetConditionForm.value.FreeQuantity,
        "option_set_dishes": JSON.stringify(this.choices),
        "inc_price_in_free": this.miscForm.value.PriceinFreeQuantityPromos = true ? 1 : 0,
        "cretaed_by": 1011
      }
    }

     if (this.optionSetForm.invalid) {
      Object.keys(this.optionSetForm.controls).forEach(key => {
        this.optionSetForm.get(key)?.markAsTouched();
           this.toastr.error('All required fields must be filled.', 'Error');
      });
    } else {
    this.apis.postApi(AppConstants.api_end_points.optionSet, this.reqbody).subscribe((data: any) => {
      console.log(data)
      if (data.code == 1) {
        Swal.fire("Success!", data.message, "success").then((result) => {
          if (result) {
            console.log("User clicked OK");
            this.modal.dismissAll();
            // this.router.navigate(["/staff/staff-list"]);
          }
        });
      }
    })}

  }
  patchValue() {
    console.log(this.myData, this.type, 'opennnnnnnnnnnnn')
    if (this.type == 'Edit' || this.type == 'View') {
      this.optionSetForm.patchValue({
        name: this.myData?.option_set_name,
        displayName: this.myData?.dispaly_name,
        description: this.myData?.description,
        disableDishNotes: this.myData.disable_dish_notes == 1 ? true : this.myData.disable_dish_notes == 0 ? false : '',
        restockMenuDaily: this.myData.disable_dish_notes == 1 ? true : this.myData.disable_dish_notes == 0 ? false : '',
        hideMenu: this.myData.hide_name == 1 ? true : this.myData.hide_name == 0 ? false : '',
        availability: [[]],
        posName: [''],
        surcharge: [''],

      });

      this.optionSetConditionForm.patchValue({
        required: this.myData.required == 1 ? true : this.myData.required == 0 ? false : '',
        SelectMultiple: this.myData.select_multiple == 1 ? true : this.myData.select_multiple == 0 ? false : '',
        enableOptionQuantity: this.myData.enable_option_quantity == 1 ? true : this.myData.enable_option_quantity == 0 ? false : '',
        MinOptionsRequired: this.myData?.min_options_required,
        MaxOptionsAllowed: this.myData?.max_options_allowed,
        FreeQuantity: this.myData?.free_qunatity,
      });

      this.miscForm.patchValue({
        PriceinFreeQuantityPromos: this.myData.inc_price_in_free_quantity_promos == 1 ? true : this.myData.inc_price_in_free_quantity_promos == 0 ? false : '',
      });
      this.hideOptionSet = JSON.parse(this.myData?.hide_opion_set_json)
      this.rowData = JSON.parse(this.myData?.option_set_combo_json)
      // this.choices=JSON.parse(this.myData?.option_set_dishes)

    }
  }

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

  // toggleExpand(category: any) {

  //   category.expanded = !category.expanded;
  // }


}