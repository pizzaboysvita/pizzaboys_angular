import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CardComponent } from "../../../shared/components/card/card.component";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddCategoryComponent } from "../add-category/add-category.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import { ApisService } from "../../../shared/services/apis.service";
import { AppConstants } from "../../../app.constants";
import Swal from "sweetalert2";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  store_id: string;
  dish_menu_id: string;
  hide_menu_in_POS: string
  is_online_hide: string
  name: string;
  display_name: string;
  price: string;
  status: string;
  hide_category_in_POS: string;
  misc: string;
}
@Component({
  selector: "app-category",
  imports: [CardComponent, AgGridAngular, NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.scss",
})
export class CategoryComponent implements OnInit {
  @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  modules = [ClientSideRowModelModule];
  stausList = ["Active", "No Stock", "Hide"];

  rowData: RowData[] = [];
  public categoryList = [];
  gridOptions = {
    pagination: true,
    rowHeight: 60
  };
  columnDefs: ColDef<RowData>[] = [
    {
      field: "store_id",
      headerName: "Store Name",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "store_id",
      valueGetter: (params: any) => this.storeNameData(params.data.store_id)
    },
    {
      field: "dish_menu_id",
      headerName: "Menu Type",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "dish_menu_id",
      valueGetter: (params: any) => this.menuNameData(params.data.dish_menu_id)
    },
    {
      field: "name",
      headerName: "Category Name",
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "name",
    },
    {
      field: "display_name",
      headerName: "Dispaly Name",
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "display_name",
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params: any) => {
        const select = document.createElement('select');
        select.className = 'custom-select';

        // mapping values
        const statusMap: Record<string | number, string> = {
          1: 'Active',
          0: 'Inactive',
          // keep as string if API sends it
        };

        const options = [
          { value: 1, label: 'Active' },
          { value: 0, label: 'Inactive' },

        ];

        const selected = statusMap[params.value] ?? params.value ?? '';

        options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.value.toString();
          option.text = opt.label;

          if (opt.label === selected || opt.value === params.value) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        const rowData = params.data;

        // Handle the change event
        select.addEventListener('change', (event) => {
          const newValue = (event.target as HTMLSelectElement).value;

          // store as number if 0/1, otherwise keep string
          const parsedValue = newValue === '1' ? 1 : newValue === '0' ? 0 : newValue;

          params.setValue(parsedValue); // Updates the grid's value
          console.log('Dropdown changed to:', parsedValue);
          const dishMenuId = params.data.dish_menu_id;
          this.updateStatus(parsedValue, params.data);
          console.log(rowData, 'rowData');
        });

        return select;
      }
    }
    ,
    {
      headerName: 'POS',
      field: 'hide_category_in_POS',
      cellRenderer: (params: any) => {
        const select = document.createElement('select');
        select.className = 'custom-select';

        // mapping values
        const statusMap: Record<string | number, string> = {
          1: 'Show of POS',
          0: 'Hide of POS',
          // keep as string if API sends it
        };

        const options = [
          { value: 1, label: 'Show of POS' },
          { value: 0, label: 'Hide of POS' },

        ];

        const selected = statusMap[params.value] ?? params.value ?? '';

        options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.value.toString();
          option.text = opt.label;

          if (opt.label === selected || opt.value === params.value) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        const rowData = params.data;

        // Handle the change event
        select.addEventListener('change', (event) => {
          const newValue = (event.target as HTMLSelectElement).value;

          // store as number if 0/1, otherwise keep string
          const parsedValue = newValue === '1' ? 1 : newValue === '0' ? 0 : newValue;

          params.setValue(parsedValue); // Updates the grid's value
          console.log('Dropdown changed to:', parsedValue);
          const dishMenuId = params.data.dish_menu_id;

          this.updateStatusPOS(parsedValue, params.data);
          console.log(rowData, 'rowData');
        });

        return select;
      }
    }
    ,
    {
      headerName: 'Web',
      field: 'is_online_hide',
      cellRenderer: (params: any) => {
        const select = document.createElement('select');
        select.className = 'custom-select';

        // mapping values
        const statusMap: Record<string | number, string> = {
          1: 'Show in Web',
          0: 'Hide in Web',
          // keep as string if API sends it
        };

        const options = [
          { value: 1, label: 'Show in Web' },
          { value: 0, label: 'Hide in Web' },

        ];

        const selected = statusMap[params.value] ?? params.value ?? '';

        options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.value.toString();
          option.text = opt.label;

          if (opt.label === selected || opt.value === params.value) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        const rowData = params.data;

        // Handle the change event
        select.addEventListener('change', (event) => {
          const newValue = (event.target as HTMLSelectElement).value;

          // store as number if 0/1, otherwise keep string
          const parsedValue = newValue === '1' ? 1 : newValue === '0' ? 0 : newValue;

          params.setValue(parsedValue); // Updates the grid's value
          console.log('Dropdown changed to:', parsedValue);
          const dishMenuId = params.data.dish_menu_id;
          this.updateStatusWeb(parsedValue, params.data);
          console.log(rowData, 'rowData');
        });

        return select;
      }
    }


    , {
      headerName: "Actions",
      cellRenderer: (params: any) => {
        return `
        <div style="display: flex; align-items: center; gap:15px;">
          <button class="btn btn-sm  p-0" data-action="view" title="View">
         <span class="material-symbols-outlined text-primary">
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
        </div>
      `;
      },
      minWidth: 150,
      flex: 1,
    },
  ];
  categoryRowData: any;
  modelRef: any;
  menuItemsList: any = [];
  menuMap: any;
  storeList: any;
  categoriesForm: FormGroup;
  loginUser: any;
  constructor(
    public modal: NgbModal,
    private apiService: ApisService,
    private sessionStorage: SessionStorageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginUser = JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user

    this.categoriesForm = this.formBuilder.group({
      store: [''],
      address: [''],
      status: ['']
    });
    if (this.loginUser.role_id != 1) {
      this.categoriesForm.patchValue({
        store: this.loginUser.store_id
      })
      this.categoriesForm.get('store')?.disable();
    } else {
      this.categoriesForm.get('store')?.enable();
    }
    this.getStoreList()


  }

  updateStatus(dishStatusId: any, rowData: any) {
    console.log("opppppppppppppp", dishStatusId)
    const reqbody = {
      "details_type": "category",
      "detail_id": rowData.id,
      "action": dishStatusId,
      "pos": rowData.hide_category_in_POS,
      "in_web_hide": rowData.is_online_hide,
      "updated_by": JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id,
    };
    console.log(reqbody, rowData, 'reqbody')
    this.apiService.patchStatusApi(reqbody).subscribe((response: any) => {
      console.log("Status updated successfully:", response);
      if (response) {
        this.getmenuList()
      }
    }, (error) => {
      console.error("Error updating status:", error);
    });
  }

  updateStatusPOS(dishPOSId: any, rowData: any) {
    console.log("opppppppppppppp", dishPOSId)
    const reqbody = {
      "details_type": "category",
      "detail_id": rowData.id,
      "action": rowData.status == 'Active' ? 1 : 0,
      "pos": dishPOSId,
      "in_web_hide": rowData.is_online_hide,
      "updated_by": JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id,
    };
    console.log(reqbody, rowData, 'reqbody')
    this.apiService.patchStatusApi(reqbody).subscribe((response: any) => {
      console.log("Status updated successfully:", response);
      if (response) {
        this.getmenuList()
      }
    }, (error) => {
      console.error("Error updating status:", error);
    });
  }
  updateStatusWeb(dishWebId: any, rowData: any) {
    console.log("opppppppppppppp", dishWebId)
    const reqbody = {
      "details_type": "category",
      "detail_id": rowData.id,
      "action": rowData.status == 'Active' ? 1 : 0,
      "pos": rowData.hide_category_in_POS,
      "in_web_hide": dishWebId,
      "updated_by": JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id,
    };
    console.log(reqbody, rowData, 'reqbody')
    this.apiService.patchStatusApi(reqbody).subscribe((response: any) => {
      console.log("Status updated successfully:", response);
      if (response) {
        this.getmenuList()
      }
    }, (error) => {
      console.error("Error updating status:", error);
    });
  }
  getStoreList() {
    this.apiService.getApi(AppConstants.api_end_points.store_list).subscribe((data: any) => {
      console.log(data)
      if (data) {
        data.forEach((element: any) => {
          element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : element.status
        })
        this.storeList = data.reverse()
        this.getmenuList()
      }
    })
  }
  searchCategory() {

  }
  getmenuList() {

    this.apiService.getApi(AppConstants.api_end_points.menu + '?store_id=' + -1).subscribe((data: any) => {
      if (data) {

        // data.data.forEach((item: any) => {
        //   item.status = item.status == 1 ? 'Active' : item.status == 0 ? 'In-Active' : ''
        // })
        this.menuItemsList = data.data
        console.log(this.menuItemsList)
        // this.menuMap = {};
        this.fetchCategories();


      }
    })
  }

  fetchCategories(): void {
    const loginRaw = this.sessionStorage.getsessionStorage("loginDetails");
    const loginData = loginRaw ? JSON.parse(loginRaw) : null;
    const userId = loginData?.user?.user_id;
    console.log(userId, 'user id');


    if (!userId) {
      console.error("No user ID found in session");
      return;
    }

    this.apiService
      .getApi(`/api/category?store_id=${loginData?.user?.store_id || -1}`)
      .subscribe((res: any) => {

        console.log(res, 'categories response');

        if (res.code === "1") {
          res.categories.forEach((categorie: any) => {
            categorie.status = categorie.status == 0 ? 'Hide' : categorie.status == 1 ? 'Active' : '--';
            categorie.hide_category_in_POS = categorie.hide_category_in_POS = 1 ? 'Hide in POS' : categorie.hide_category_in_POS == 0 ? 'Show in POS' : '--'
          })
          this.rowData = res.categories


        } else {
          console.error("Failed to load categories:", res.message);
        }
      });
  }
  onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, 'target action')
    const action = target?.getAttribute("data-action");
    this.categoryRowData = event.data;
    console.log(this.categoryRowData)
    if (action === "view") {
      console.log(event.data)
      this.insertCategory('View')
    } else if (action === "edit") {
      this.insertCategory("Edit")
    } else if (action === "delete") {
      this.delete(event.data);
    }
  }
  delete(data: any) {
    console.log(data)

    this.modelRef = this.modal.open(this.confirmModalRef, {
      centered: true,
      backdrop: 'static'
    });
  }
  insertCategory(type: any) {
    const modalRef = this.modal.open(AddCategoryComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "lg",
    });
    modalRef.componentInstance.type = type
    modalRef.componentInstance.myData = this.categoryRowData
    modalRef.closed.subscribe((result) => {
      if (result === "refresh") {

      }

    });
    modalRef.result.then(
      (result) => {
        // Modal closed with a result
        console.log('Modal closed with:', result);
        this.fetchCategories();
      },
      (reason) => {
        // Modal dismissed (e.g. clicking outside, ESC key)
        console.log('Modal dismissed with:', reason);
        this.fetchCategories();
      }
    );
  }
  onConfirm() {
    console.log(this.categoryRowData)
    const reqbody = {
      "type": "delete",
      "id": this.categoryRowData.id,
      "store_id": this.categoryRowData.store_id


    }
    const formData = new FormData();
    formData.append("category_image", ''); // Attach Blob with a filename
    formData.append("body", JSON.stringify(reqbody));
    this.apiService.postApi(AppConstants.api_end_points.categoryV2, formData).subscribe((data: any) => {
      console.log(data)
      if (data.code == 1) {
        this.modelRef.close();
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          width: '350px',  // customize width (default ~ 600px)
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('User clicked OK');
            this.fetchCategories();
          }
        });
      }
    })
  }
  storeNameData(data: any) {
    console.log(this.storeList, 'storeeeeee namee')
    const storeName = this.storeList.find((store: any) => store.store_id == data)
    console.log(storeName, 'storeeeeeeeee nammmme')
    return storeName ? storeName.store_name : '--'
  }
  menuNameData(data: any): string {
    console.log(this.menuItemsList, data)
    const match = this.menuItemsList.find((item: any) => item.dish_menu_id === data);
    console.log(match, 'oppppppppppppppeeeeeeee');
    return match?.name || '--';
  }
}


