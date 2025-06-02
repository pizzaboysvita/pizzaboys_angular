import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableConfig } from '../../../shared/interface/table.interface';
import { staffList } from '../../../shared/data/products';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TableComponent } from '../../widgets/table/table.component';
import { Router } from '@angular/router';
import { AppConstants } from '../../../app.constants';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ApisService } from '../../../shared/services/apis.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';

@Component({
  selector: 'app-staff-list',
    imports: [CardComponent,CommonModule],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.scss'
})
export class StaffListComponent {
   @ViewChild('confirmModal') confirmModalRef!: TemplateRef<any>;
  staff_list: any=[];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
    public tableConfig= [
     
          { title: "Staff Id", dataField: 'staff_id', class: 'f-w-600' },
          { title: "Staff Photo", dataField: 'user_image', type: 'image', class: 'rounded' },
          { title: "Name", dataField: 'fullname' },
          { title: "Email", dataField: 'email', class: 'f-w-600' },
          { title: "Phone", dataField: 'phone_number' },
           { title: "Address", dataField: 'address' },
           { title: "Status", dataField: 'status' },
            // { title: "Options", type: "status" },
      
     
     
       
      ]
  staffData: any;
  constructor(private router:Router,private apis:ApisService,private modalService: NgbModal,private session: SessionStorageService){
    this.getStaffList()
  }
  
    stausList=['Active','In-Active']
  
    getStaffList(){
       const statusClassMap: Record<string, string> = {
      'Active': 'badge bg-success text-white px-1 py-1'
    };
      this.apis.getApi(AppConstants.api_end_points.staff).subscribe((data:any)=>{
        if(data){
data.forEach((element:any)=>{
  // element.option=''
  element.user_image= null,
  element.fullname=element.first_name+' '+element.last_name
  element.status=element.status ==1?'Active':element.status ==0?'Inactive':''
})
          this.staff_list=data
        
        }
      })
    }
    openNew(){
      this.router.navigate(["/staff/add-staff"]);

    }
      getColorForName(name: string): string {
    if (!name) return '#6c757d'; // default fallback
  
    // Hash the name to get a consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Convert hash to HSL color
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 50%)`; // You can tweak saturation/lightness as needed
  }
  performAction(data:any){

    console.log(data)
  }
      onSort(columnKey: any): void {
    if (columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }
  
    // Optionally trigger actual sorting of data here
  } 
  delete(data:any){
    this.staffData=data
      this.openConfirmPopup()

  }
    openConfirmPopup() {
  this.modalService.open(this.confirmModalRef, {
    centered: true,
    backdrop: 'static'
  });
}
 onConfirm(modal: any) {
   // modal.close();
   // Perform your confirm logic here
   const req_body={
     "staff_id": this.staffData.staff_id
 }
  this.apis.deleteApi(AppConstants.api_end_points.staff,req_body).subscribe((data:any)=>{
  
   if(data){
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
     this.getStaffList();
   }
 });
 
   }
  })
 }
}
