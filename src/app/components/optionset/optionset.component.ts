import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';

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

    @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;

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
    , 
    
    {
  headerName: 'Status',
  field: 'status',
  cellRenderer: (params: any) => {
    const select = document.createElement('select');
    select.className = 'custom-select';
  

    const options = ['Active','Hide', 'Hide Online', 'Hide POS'];
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
      console.log(rowData,'rowData')
    });

    return select;
  }
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
  optSetRowData: any;
  optSetDetailsLeng: any =0;
  optSortSetDetails: any;

  constructor(private fb: FormBuilder, private modal: NgbModal, private apis: ApisService, private sessionStorage: SessionStorageService) {
    this.searchForm = this.fb.group({
      name: [''],
      displayName: [''],
      status: [null]
    });
  }

  ngOnInit() {
    this.getOptionSets()
  }

  getOptionSets() {
    console.log("oppppppppppppppppp")
    this.apis.getApi('/api/optionset?store_id=' + -1).subscribe((data: any) => {
      if (data.code==1) {
        console.log(data, 'optionnnnnnnn')
         data.data.forEach((item:any)=>{
          item.status=item.status ==1?'Active':item.status ==0?'Inactive':'--'
         })
        this.optSetDetails = data.data
        this.optSortSetDetails = data.data

         this.optSetDetailsLeng = data.data.length
      }
    })
  }

  reset() {
    this.searchForm.reset();
    this.getOptionSets();
  }
searchOpt() {
  const f = this.searchForm.value;

  this.optSetDetails = this.optSortSetDetails.filter((x: any) => {
    return (
      (!f.name || x.option_set_name.toLowerCase().includes(f.name.toLowerCase())) &&
      (!f.displayName || x.dispaly_name.toLowerCase().includes(f.displayName.toLowerCase())) &&
      (!f.status || x.status.toLowerCase().includes(f.status.toLowerCase()))
    );
  });

  console.log(this.optSetDetails);
}




  onCellClicked(event: any) {
   let target = event.event?.target as HTMLElement;

    // Traverse up the DOM to find the element with data-action
    while (target && !target.dataset?.['action'] && target !== document.body) {
      target = target.parentElement as HTMLElement;
    }
    console.log(target, 'target action')
    const action = target?.getAttribute("data-action");
this.optSetRowData=event.data
    if (action === 'view') {
      this.createOptionSet('View')
      // console.log('Viewing', row);
    } else if (action === 'edit') {
      // console.log('Editing', row);
      this.createOptionSet('Edit')
    } else if (action === 'delete') {
      console.log('Deleting',event.data);
      this.openConfirmPopup()
    }
  }

  createOptionSet(type:any) {
    const modalRef = this.modal.open(AddoptionsetmodalComponent, {
      windowClass: 'theme-modal',
      centered: true,
      size: 'lg'
    });
      modalRef.componentInstance.type =type;
    modalRef.componentInstance.myData =this.optSetRowData;
    modalRef.result.then(
  (result) => {
    if (result) {
      console.log("Option set saved and modal closed.");
      this.getOptionSets(); // or any refresh logic
    }
  },
  (reason) => {
    console.log("Modal dismissed", reason);
     this.getOptionSets();
  }
);


  }

  openConfirmPopup() {
    this.modal.open(this.confirmModalRef, {
      centered: true,
      backdrop: 'static'
    });
  }
 onConfirm(modal: any) {
     // modal.close();
     // Perform your confirm logic here
     // const req_body = {
     //   "staff_id": this.staffData.staff_id
     // }
    console.log(this.optSetRowData)
     this.apis.deleteApi(AppConstants.api_end_points.optionSet + '/' +this.optSetRowData.option_set_id).subscribe((data: any) => {
 
       if (data) {
         console.log(data)
         modal.close();
         Swal.fire({
           title: 'Success!',
           text: data.message,
           icon: 'success',
           width: '350px',  // customize width (default ~ 600px)
         }).then((result) => {
           if (result.isConfirmed) {
             console.log('User clicked OK');
             this.getOptionSets();
           }
         });
 
       }
     })
   }
}
