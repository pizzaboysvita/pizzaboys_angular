import { Component, TemplateRef, ViewChild } from "@angular/core";
import { CardComponent } from "../../../shared/components/card/card.component";
// import { TableComponent } from '../../widgets/table/table.component';
import { TableConfig } from "../../../shared/interface/table.interface";
import { ProductsList } from "../../../shared/data/products";
import { AgGridAngular } from "@ag-grid-community/angular";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColDef, ITooltipParams, ModuleRegistry } from "@ag-grid-community/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddMenuModalComponent } from "../add-menu-modal/add-menu-modal.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { ApisService } from "../../../shared/services/apis.service";
import { AppComponent } from "../../../app.component";
import { AppConstants } from "../../../app.constants";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import FileSaver from "file-saver";
import * as ExcelJS from 'exceljs';
import Swal from "sweetalert2";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  store_id: string
  hide_menu_in_POS:Number
  is_online_hide:Number
  dish_menu_id: string;
  name: string;
  display_name: number;
  created_on: string;
  description: string;
  status: string;
}

@Component({
  selector: "app-add-menus",
  imports: [CardComponent, AgGridAngular, NgSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./add-menus.component.html",
  styleUrl: "./add-menus.component.scss",
  providers: [DatePipe]
})
export class AddMenusComponent {
  modules = [ClientSideRowModelModule];
  @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  public products = ProductsList;
  stausList = ["Active", "In-Active"];

  menuSearchForm: FormGroup;
  columnDefs: ColDef<RowData>[] = [
    // <-- Important to give <RowData> here!
    {
      field: "store_id",
      headerName: "Store Name",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      valueGetter: (params: any) => this.storeNameData(params.data.store_id),
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "name",
      headerName: "Menu Name",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    {
      field: "display_name",
      headerName: "Display Name",
      suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
    },
    // {
    //   field: "description",
    //   headerName: "Description",
    //   suppressMenu: true,
    //   unSortIcon: true,
    //   tooltipValueGetter: (p: ITooltipParams) => p.value,
    // },
    {
      field: 'created_on', headerName: 'Created Date', suppressMenu: true,
      unSortIcon: true,
      tooltipValueGetter: (p: ITooltipParams) => p.value,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
      }
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
      field: 'hide_menu_in_POS',
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
,
    {
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




  public menuList = [
    { id: 1, name: "TakeWay Menu" },
    { id: 2, name: "Seasonal menu" },
    {
      id: 3,
      name: "Cycle menu",
    },
  ];
  menuItemsList: any = []
  menuData: any;
  storeList: any;
  modelRef: any;
  menuItemsSortingList: any;
  loginUser: any;
  constructor(public modal: NgbModal, private datePipe: DatePipe, private fb: FormBuilder, private apis: ApisService, private session: SessionStorageService, private modalService: NgbModal) { }

  getFrom() {
    this.loginUser= JSON.parse(this.session.getsessionStorage('loginDetails') as any).user
   
    this.menuSearchForm = this.fb.group({
      store: ['-1'],
      menuName: [''],
      status: ['']
    })
     if(this.loginUser.role_id !=1){
      this.menuSearchForm.patchValue({
        store: [this.loginUser.store_id] 
      })
      this.menuSearchForm.get('store')?.disable(); 
    }else{
       this.menuSearchForm.get('store')?.enable(); 
    }
  }

 


   updateStatus(dishStatusId:any, rowData:any){
    console.log("opppppppppppppp",dishStatusId)
 const reqbody = {
      "details_type": "menu",
      "detail_id": rowData.dish_menu_id,
      "action": dishStatusId,
      "pos": rowData.hide_menu_in_POS,
      "in_web_hide": rowData.is_online_hide,
      "updated_by": JSON.parse(this.session.getsessionStorage('loginDetails') as any).user.user_id,
    };
    console.log(reqbody,rowData,'reqbody')
 this.apis.patchStatusApi(reqbody).subscribe((response:any) => {
      console.log("Status updated successfully:", response);
      if(response){
        this.getmenuList()
      }
    }, (error) => {
      console.error("Error updating status:", error);
    });
  }

   updateStatusPOS(dishPOSId:any, rowData:any){
    console.log("opppppppppppppp",dishPOSId)
 const reqbody = {
      "details_type": "menu",
      "detail_id": rowData.dish_menu_id,
      "action": rowData.status == 'Active' ? 1 : 0,
      "pos": dishPOSId,
      "in_web_hide": rowData.is_online_hide,
      "updated_by": JSON.parse(this.session.getsessionStorage('loginDetails') as any).user.user_id,
    };
    console.log(reqbody,rowData,'reqbody')
 this.apis.patchStatusApi(reqbody).subscribe((response:any) => {
      console.log("Status updated successfully:", response);
      if(response){
        this.getmenuList()
      }
    }, (error) => {
      console.error("Error updating status:", error);
    });
  }
  updateStatusWeb(dishWebId:any, rowData:any){
    console.log("opppppppppppppp",dishWebId)
 const reqbody = {
      "details_type": "menu",
      "detail_id": rowData.dish_menu_id,
      "action": rowData.status == 'Active' ? 1 : 0,
      "pos": rowData.hide_menu_in_POS,
        "in_web_hide": dishWebId,
      "updated_by": JSON.parse(this.session.getsessionStorage('loginDetails') as any).user.user_id,
    };
    console.log(reqbody,rowData,'reqbody')
 this.apis.patchStatusApi(reqbody).subscribe((response:any) => {
      console.log("Status updated successfully:", response);
      if(response){
        this.getmenuList()
      }
    }, (error) => {
      console.error("Error updating status:", error);
    });
  }
  ngOnInit() {
    this.getFrom()
    this.getStoreList()
  }
  getStoreList() {
    this.apis.getApi(AppConstants.api_end_points.store_list).subscribe((data: any) => {
      console.log(data)
      if (data) {
        data.forEach((element: any) => {
          element.status = element.status == 1 ? 'Active' : element.status == 0 ? 'Inactive' : element.status
        })
         data.unshift({ store_id: -1, store_name: 'All Store' })
        this.storeList = data
        this.getmenuList()
      }
    })
  }
   getmenuList() {
    const selectedStores = this.menuSearchForm.getRawValue().store;
console.log(selectedStores, 'selected storeee')
    let storeParam = Array.isArray(selectedStores)
      ? selectedStores.join(',')
      : selectedStores;

    if (storeParam == -1 || storeParam === '-1') storeParam = '';

    this.apis.getApi(`${AppConstants.api_end_points.menu}?store_id=${-1}`).subscribe((data: any) => {
      if (data) {
        data.data.forEach((item: any) => {
          item.status = item.status == 1 ? 'Active' : item.status == 0 ? 'In-Active' : '';
        });
        this.menuItemsList = data.data;
        this.menuItemsSortingList = data.data;
      }
    });
  }

  storeNameData(data: any) {
    console.log(this.storeList, 'storeeeeee namee')
    const storeName = this.storeList.find((store: any) => store.store_id == data)
    console.log(storeName, 'storeeeeeeeee nammmme')
    return storeName ? storeName.store_name : '--'
  }
  onCellClicked(event: any): void {
    let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, 'target action')
    const action = target?.getAttribute("data-action");
    this.menuData = event.data;
    console.log(action)
    if (action === "view") {
      console.log(event.data)
      this.insertMenu('View')
    } else if (action === "edit") {
      this.insertMenu("Edit")
    } else if (action === "delete") {
      console.log("deleteeeeeeeee")
      this.openConfirmPopup()
    }
  }
  openConfirmPopup() {
    this.modelRef = this.modalService.open(this.confirmModalRef, {
      centered: true,
      backdrop: 'static'
    });
  }
  onConfirm(data: any) {
    console.log(this.menuData)
    const reqbody = {
      "type": "delete",
      "menu_id": this.menuData.dish_menu_id.toString(),
      store_id: this.menuData.store_id
    }
    const formData = new FormData();
    // formData.append("image", this.file); // Attach Blob with a filename
    formData.append("body", JSON.stringify(reqbody));

    this.apis.postApi(AppConstants.api_end_points.menuV2, formData).subscribe((data: any) => {
      if (data) {
        console.log(data)

        this.modelRef.close();
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          width: '350px',  // customize width (default ~ 600px)
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('User clicked OK');
            this.getmenuList();
          }
        });
      }
    })
  }

  insertMenu(type: any) {
    const modalRef = this.modal.open(AddMenuModalComponent, {
      windowClass: "theme-modal",
      centered: true,
      size: "lg",
    });
    console.log(this.menuData)
    modalRef.componentInstance.type = type
    modalRef.componentInstance.myData = this.menuData
    modalRef.result.then(
      (result) => {
        // Modal closed with a result
        console.log('Modal closed with:', result);
        this.getmenuList()
      },
      (reason) => {
        // Modal dismissed (e.g. clicking outside, ESC key)
        console.log('Modal dismissed with:', reason);
        this.getmenuList()
      }
    );
  }
  downloadDevicesExcel(): void {
    if (!this.menuItemsList || this.menuItemsList.length === 0) {
      console.warn('No data to export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Stores');

    // Define header row with styles
    const headers = Object.keys(this.menuItemsList[0]).map(key => {
      // Capitalize each word from snake_case or camelCase
      const formattedHeader = key
        .replace(/_/g, ' ')                           // snake_case -> snake case
        .replace(/([a-z])([A-Z])/g, '$1 $2')          // camelCase -> camel Case
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word

      return {
        header: formattedHeader,
        key: key,
        width: 20
      };
    });
    worksheet.columns = headers;

    worksheet.getRow(1).eachCell((cell: any) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E78' }, // dark blue
      };
    });

    // Add data rows
    this.menuItemsList.forEach((store: any) => {
      const row: Record<string, any> = {};

      Object.keys(store).forEach(key => {
        row[key] = store[key] ?? ''; // use '' for null or undefined
      });
      worksheet.addRow(row);
    })
    // Create buffer and save
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const formattedDate = this.datePipe.transform(new Date(), 'dd MMM yyyy');

      FileSaver.saveAs(blob, `Menu List ${formattedDate}.xlsx`);
    });

  }
  search() {
    console.log(this.menuItemsSortingList, this.menuSearchForm.value, this.menuSearchForm.value.store)

    if( this.menuSearchForm.value.menuName !== '' || this.menuSearchForm.value.status !== '' || this.menuSearchForm.value.store !== -1){
    this.menuItemsList = this.menuItemsSortingList.filter((store: any) => {
      return (
        (
          (!this.menuSearchForm.value.store || store.store_id.toString().includes(this.menuSearchForm.value.store.toString()))
          && (!this.menuSearchForm.value.menuName || store.name.toLowerCase().includes(this.menuSearchForm.value.menuName.toLowerCase()))
          && (!this.menuSearchForm.value.status || store.status.toLowerCase().includes(this.menuSearchForm.value.status.toLowerCase()))
        )
      )

    });
  }else{
    return this.menuItemsList = this.menuItemsSortingList;
  }
    console.log(this.menuItemsSortingList)
  }
  reset() {
    // this.menuSearchForm.reset()
    this.getFrom()
    this.getmenuList()

  }
}
