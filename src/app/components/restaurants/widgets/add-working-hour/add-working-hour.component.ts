import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from "../../../setting/widgets/dropdown/dropdown.component";
import { CardComponent } from '../../../../shared/components/card/card.component';
import { TableComponent } from '../../../widgets/table/table.component';
import { TableConfig } from '../../../../shared/interface/table.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionStorageService } from '../../../../shared/services/session-storage.service';

@Component({
    selector: 'app-add-working-hour',
    templateUrl: './add-working-hour.component.html',
    styleUrl: './add-working-hour.component.scss',
    imports: [CardComponent,TableComponent,FormsModule,ReactiveFormsModule]
})

export class AddWorkingHourComponent {
addWorkingForm:FormGroup
  storeData: any;
  constructor(public modal: NgbActiveModal,private fb:FormBuilder,private session:SessionStorageService) { }
  public day = [
      { "day": "Select Day", "id": "0" },
  { "day": "Sunday", "id": "1" },
  { "day": "Monday", "id": "2" },
  { "day": "Tuesday", "id": "3" },
  { "day": "Wednesday", "id": "4" },
  { "day": "Thursday", "id": "5" },
  { "day": "Friday", "id": "6" },
  { "day": "Saturday", "id": "7" }
]

  workingHours: any[] = [];
  public tableConfig: TableConfig = {
    columns: [
      { title: "No", dataField: 'id', class: 'f-w-600' },
      { title: "Day", dataField: 'day' },
      { title: "From Time", dataField: 'from', class: 'f-w-600' },
      { title: "To Time", dataField: 'to' },
      { title: "Options", type: "option" },

      // { title: "Actions", dataField: '', class: 'action-column' } 
    ],
    rowActions: [
      { icon: "ri-pencil-line", permission: "edit" },
      { icon: "ri-delete-bin-line", permission: "delete" },
    ],
    data: [] // will be filled in ngOnInit
  };
  
  ngOnInit() {
        const storeType=this.session.getsessionStorage('storeType')
        if(storeType =='view'|| storeType =='edit'){
         
    this.storeData=JSON.parse(this.session.getsessionStorage('storeDetails') as any)
      console.log(this.storeData)
     const working_hours1=JSON.parse(this.storeData.working_hours) as any
     console.log(working_hours1)
     console.log(typeof working_hours1)
   this.workingHours = typeof working_hours1 === "string" ? JSON.parse(working_hours1) : working_hours1;

        }
    this.addWorkingForm=this.fb.group({
      day:['Select Day'],
      formtime:[''],
      to:['']
    })
     
    this.generateTableData();
  }
  
  private generateTableData() {
    const selectedDays = this.day.slice(1, 6); // Skip 'Select Days', get first 5 actual days
    if(this.session.getsessionStorage('storeType') =='view' || this.session.getsessionStorage('storeType') =='edit' ){
  
         console.log('viewwwww',this.workingHours)
      this.tableConfig.data=[]
    this.tableConfig.data =this.workingHours
    }else{
     
      this.tableConfig.data =this.workingHours
    }
    console.log(  this.tableConfig.data )
  }
  save(){
    this.workingHours.push({
        id: this.workingHours.length + 1, // Auto-incrementing ID
        day: this.addWorkingForm.value.day,
        from: this.addWorkingForm.value.formtime,
        to: this.addWorkingForm.value.to,
      });
      console.log(this.workingHours)
         this.addWorkingForm.reset()
      this.generateTableData()
  }
close(){
  this.modal.close(this.workingHours);
    this.modal.dismiss();
}
Cancel(){}
}
