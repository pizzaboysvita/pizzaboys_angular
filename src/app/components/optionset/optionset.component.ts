import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ColDef, ModuleRegistry } from '@ag-grid-community/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CardComponent } from '../../shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddoptionsetmodalComponent } from './addoptionsetmodal/addoptionsetmodal.component';
import { ApisService } from '../../shared/services/apis.service';
import { AppConstants } from '../../app.constants';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
interface RowData {
  option_set_name: string;
  dispaly_name: string;
  status: string
  created_on: string
}

@Component({
  selector: 'app-optionset',
  standalone: true,
  templateUrl: './optionset.component.html',
  styleUrls: ['./optionset.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridAngular,
    NgSelectModule,
    CardComponent
  ]
})
export class OptionsetComponent implements OnInit {
  searchForm: FormGroup;
  statusList = ['Active', 'In-Active', 'Pending'];
  modules = [ClientSideRowModelModule];


  columnDefs: ColDef<RowData>[] = [
    {
      field: "option_set_name",
      headerName: "Option Set Name",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "option_set_name",

    },
    {
      field: "dispaly_name",
      headerName: "Dispaly Name",
      sortable: true,
      suppressMenu: true,
      unSortIcon: true,
      tooltipField: "dispaly_name",

    },
    {
      field: 'created_on', headerName: 'Created Date', suppressMenu: true,
      unSortIcon: true,
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
    }
    , {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => {
        let statusClass = "";
        if (params.value === "Active") {
          statusClass = "status-active";
        } else if (params.value === "No Stock") {
          statusClass = "status-no-stock";
        } else if (params.value === "Hide") {
          statusClass = "status-hide";
        }
        if (params.value === "") {
          return `
             <select class="status-dropdown" onchange="updateStatus(event, ${params.rowIndex})">
                 <option value="">Select Status</option>
               <option value="Active">Active</option>
               <option value="No Stock">No Stock</option>
               <option value="Hide">Hide</option>
             </select>
           `;
        }
        return `<div class="status-badge ${statusClass}">${params.value}</div>`;
      },
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Active", "No Stock", "Hide"],
      },
      suppressMenu: true,
      unSortIcon: true,
    },


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
  optSetDetails: RowData[] =[];

  constructor(private fb: FormBuilder, private modal: NgbModal, private apis: ApisService, private sessionStorage: SessionStorageService) {
    this.searchForm = this.fb.group({
      name: [''],
      displayName: [''],
      status: ['']
    });
  }

  ngOnInit() {
    this.getOptionSets()
  }

  getOptionSets() {
    console.log("oppppppppppppppppp")
    this.apis.getApi('/api/optionset?user_id=' + JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id).subscribe((data: any) => {
      if (data.code==1) {
        console.log(data, 'optionnnnnnnn')
         data.data.forEach((item:any)=>{
          item.status=item.status ==1?'Active':item.status ==0?'Inactive':'--'
         })
        this.optSetDetails = data.data
      }
    })
  }

  reset() {
    this.searchForm.reset();
  }


  onCellClicked(event: any) {
    const action = event.event?.target?.dataset?.action;
    const row = event.data;

    if (action === 'view') {
      console.log('Viewing', row);
    } else if (action === 'edit') {
      console.log('Editing', row);
    } else if (action === 'delete') {
      console.log('Deleting', row);
    }
  }

  createOptionSet() {
    const modalRef = this.modal.open(AddoptionsetmodalComponent, {
      windowClass: 'theme-modal',
      centered: true,
      size: 'lg'
    });


  }

}
