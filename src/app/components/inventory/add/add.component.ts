import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApisService } from '../../../shared/services/apis.service';
import { AppConstants } from '../../../app.constants';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgSelectModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @Input() editData: any = null;   // ✅ For editing
  @Input() type: any;   // ✅ For editing
  inventoryForm!: FormGroup;
  isSubmitting = false;
  storesList:any
  private token = 'YOUR_JWT_TOKEN'; // Replace with your real token from auth
  payload: any;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private apiService: ApisService,private sessionStorage: SessionStorageService, public modal: NgbModal,
  ) {}

  ngOnInit(): void {
    this.storeList();
    this.inventoryForm = this.fb.group({
      store_id:['',Validators.required],
      item_name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      unit: ['kg', Validators.required],
      item_state: ['D', Validators.required], // Draft / Final
      imported_from: ['Local Supplier', Validators.required],
      created_by: [101, Validators.required],
      status:[true]
    });

    if (this.type=='Edit') {
      this.inventoryForm.patchValue(this.editData);
    }
    else if(this.type=='View'){
      this.inventoryForm.patchValue(this.editData);
      this.inventoryForm.disable();
    }
    else{
      this.inventoryForm.reset();
      this.inventoryForm.get('unit')?.setValue('kg');
      this.inventoryForm.get('item_state')?.setValue('D');
      this.inventoryForm.get('imported_from')?.setValue('Local Supplier');
      this.inventoryForm.get('status')?.setValue(true)

    }
  }

  get f() {
    return this.inventoryForm.controls;
  }
  storeList() {
    this.apiService
      .getApi(AppConstants.api_end_points.store_list)
      .subscribe((data:any) => {
        if (data) {
          console.log(data);
           data.unshift({ store_id: '', store_name: 'All Stores' })
          this.storesList = data;
        }
      });

  }
  save() {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    if (this.type == 'Edit') {
        this.payload = {
  "type": "update",
  item_id:this.editData.item_id,
  "store_id":this.inventoryForm.value.store_id,
  "item_name": this.inventoryForm.value.item_name,
  "quantity": this.inventoryForm.value.quantity,
  "unit": this.inventoryForm.value.unit,
  "item_state": 'F',
  "imported_from": this.inventoryForm.value.imported_from,
  "created_by": JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id,
  "status": this.inventoryForm.value.status == true ? 1 : 0,

}

    } else {
       this.payload = {
  "type": "insert",
  "store_id":this.inventoryForm.value.store_id,
  "item_name": this.inventoryForm.value.item_name,
  "quantity": this.inventoryForm.value.quantity,
  "unit": this.inventoryForm.value.unit,
  "item_state": 'F',
  "imported_from": this.inventoryForm.value.imported_from,
  "status": this.inventoryForm.value.status == true ? 1 : 0,
  "created_by": JSON.parse(this.sessionStorage.getsessionStorage('loginDetails') as any).user.user_id,
}
    }

       this.apiService.postApi(AppConstants.api_end_points.inventory, this.payload).subscribe((res: any) => {
              if (res.code === "1") {
                Swal.fire("Success!", res.message, "success").then((result) => {
                  if (result) {
                      this.isSubmitting = false;
                    console.log("User clicked OK");
                    // this.router.navigate(["/menus/dish"]);
                    this.modal.dismissAll();
      
                  }
                });
                // this.modal.dismissAll("refresh");
              } else {
                  this.isSubmitting = false;
                alert(res.message || "Failed to add Dish");
              }
            });
    }
  

  cancel() {
    this.activeModal.dismiss('cancel');
  }
}
