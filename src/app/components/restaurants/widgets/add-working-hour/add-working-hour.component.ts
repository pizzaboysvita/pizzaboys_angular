import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownComponent } from "../../../setting/widgets/dropdown/dropdown.component";
import { CardComponent } from '../../../../shared/components/card/card.component';
import { TableComponent } from '../../../widgets/table/table.component';
import { TableConfig } from '../../../../shared/interface/table.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionStorageService } from '../../../../shared/services/session-storage.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-working-hour',
  templateUrl: './add-working-hour.component.html',
  styleUrl: './add-working-hour.component.scss',
  imports: [CommonModule, CardComponent, FormsModule, ReactiveFormsModule]
})

export class AddWorkingHourComponent {
  addWorkingForm: FormGroup
  storeData: any;
  constructor(public modal: NgbActiveModal, private fb: FormBuilder, private session: SessionStorageService) { }
  public day = [
    { "day": "Sunday", "id": "1" },
    { "day": "Monday", "id": "2" },
    { "day": "Tuesday", "id": "3" },
    { "day": "Wednesday", "id": "4" },
    { "day": "Thursday", "id": "5" },
    { "day": "Friday", "id": "6" },
    { "day": "Saturday", "id": "7" }
  ]

  columns: any[] = [
    { title: "No", dataField: 'id', class: 'f-w-600' },
    { title: "Day", dataField: 'day' },
    { title: "From Time", dataField: 'from', class: 'f-w-600' },
    { title: "To Time", dataField: 'to' },
    // { title: "Options", type: "option" },

    // { title: "Actions", dataField: '', class: 'action-column' } 
  ]
  rowActions: any[] = [
    { icon: "ri-pencil-line", permission: "edit" },
    { icon: "ri-delete-bin-line", permission: "delete" },
  ]
  workingHours: any[] = [];
  public tableConfig: TableConfig = {


    data: [] // will be filled in ngOnInit
  };

  ngOnInit() {
    const storeType = this.session.getsessionStorage('storeType')
    if (storeType == 'view' || storeType == 'edit') {

      this.storeData = JSON.parse(this.session.getsessionStorage('storeDetails') as any)
      console.log(this.storeData)
      const working_hours1 = JSON.parse(this.storeData.working_hours) as any
      console.log(working_hours1)
      console.log(typeof working_hours1)
      this.workingHours = typeof working_hours1 === "string" ? JSON.parse(working_hours1) : working_hours1;

    }
    // else{
      const data = sessionStorage.getItem('workingHours');
      if (data) {
        this.workingHours = JSON.parse(data); // parse only the value, not the key 
      }
        // else {
      //   this.workingHours = []; // fallback when no data
      // }
   // }
    

    this.createFrom()
    this.generateTableData();
  }
  createFrom() {
    this.addWorkingForm = this.fb.group({
      id: [''],
      day: ['-1', [Validators.required]],
      formtime: ['', [Validators.required]],
      to: ['', [Validators.required]]
    })
    this.addWorkingForm.get('to')?.valueChanges.subscribe(to => {
  const from = this.addWorkingForm.get('formtime')?.value;
  if (from && to && from >= to) {
    this.addWorkingForm.get('to')?.reset();
  }
});

this.addWorkingForm.get('formtime')?.valueChanges.subscribe(from => {
  const to = this.addWorkingForm.get('to')?.value;
  if (from && to && from >= to) {
    this.addWorkingForm.get('formtime')?.reset();
  }
});

  }

  private generateTableData() {
    const selectedDays = this.day.slice(1, 6); // Skip 'Select Days', get first 5 actual days
    if (this.session.getsessionStorage('storeType') == 'view' || this.session.getsessionStorage('storeType') == 'edit') {

      console.log('viewwwww', this.workingHours)
      this.tableConfig.data = []
      this.tableConfig.data = this.workingHours
    } else {

      this.tableConfig.data = this.workingHours
    }
    console.log(this.tableConfig.data)
  }
  save() {
    const newDay = this.addWorkingForm.value.day;
    // const isDayExists = this.workingHours.some(item => item.day === newDay);

    const index = this.workingHours.findIndex(item => item.id === this.addWorkingForm.value.id);

    if (index !== -1) {
      // If day exists, update the object at that index
      this.workingHours[index] = {
        ...this.workingHours[index],
        // update with new data here
        day: this.addWorkingForm.value.day,
        from: this.addWorkingForm.value.formtime,
        to: this.addWorkingForm.value.to,
        // add other fields you want to update
      };
      this.createFrom()
      this.generateTableData()
    } else {
      const newDay = this.addWorkingForm.value.day;
      const isDayExists = this.workingHours.some(item => item.day === newDay);

      // If day doesn't exist, add a new object
      if (!isDayExists) {
        this.workingHours.push({
          id: this.workingHours.length + 1, // Auto-incrementing ID
          day: this.addWorkingForm.value.day,
          from: this.addWorkingForm.value.formtime,
          to: this.addWorkingForm.value.to,
        });
        console.log(this.workingHours)
        this.createFrom()

        this.generateTableData()
      } else {
        Swal.fire('Error!', this.addWorkingForm.value.day + ' ' + 'is exist', 'error')
      }
    }
      sessionStorage.setItem('workingHours',JSON.stringify(this.workingHours))

  }
  close() {
    this.modal.close(this.workingHours);
    this.modal.dismiss();
  }
  Cancel() { 
    this.createFrom()
  }
  performAction(action: any, rowData: any,index:any) {
    console.log(action, rowData)
    if (action.permission == 'edit') {
      this.addWorkingForm.patchValue({
        id: rowData.id,
        day: rowData.day,
        formtime: rowData.from,
        to: rowData.to,
      })

    }
    if (action.permission == 'delete') {
      this.workingHours.splice(index, 1);
  this.workingHours = [...this.workingHours];
    }
  }
}
