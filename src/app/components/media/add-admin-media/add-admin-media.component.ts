import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ApisService } from "../../../shared/services/apis.service";
import { SessionStorageService } from "../../../shared/services/session-storage.service";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-admin-media",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: "./add-admin-media.component.html",
  styleUrl: "./add-admin-media.component.scss",
})
export class AddAdminMediaComponent {

  @Input() editData: any = null;

  addMediaForm!: FormGroup;
  isSubmitting = false;
  storesList: any[] = [];

  bannerTypes = [
    { label: 'Default', value: 'default' },
    { label: 'Time Based', value: 'timebased' }
  ];

  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;
  selectedpromoImageFile: File | null = null;;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private apiService: ApisService,
    private sessionStorage: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.storeList();

    this.addMediaForm = this.fb.group({
      store_id: [[], Validators.required],
      text: ["", Validators.required],
      image: [null],
      video: [null],
      banner_type: ["default", Validators.required],
      start_date: [""],
      end_date: [""],
      status: [true],
      promoBanner:[null]
    });

    // Timebased validation
    this.addMediaForm.get('banner_type')?.valueChanges.subscribe(type => {
      if (type === 'timebased') {
        this.addMediaForm.get('start_date')?.setValidators(Validators.required);
        this.addMediaForm.get('end_date')?.setValidators(Validators.required);
      } else {
        this.addMediaForm.get('start_date')?.clearValidators();
        this.addMediaForm.get('end_date')?.clearValidators();
        this.addMediaForm.patchValue({ start_date: '', end_date: '' });
      }

      this.addMediaForm.get('start_date')?.updateValueAndValidity();
      this.addMediaForm.get('end_date')?.updateValueAndValidity();
    });

    // Edit mode
    if (this.editData) {
      let storeArray = [];
      if (typeof this.editData.store_id === 'string') {
        storeArray = this.editData.store_id.split(',').map((id: any) => Number(id));
      } else {
        storeArray = [this.editData.store_id];
      }

      this.addMediaForm.patchValue({
        store_id: storeArray,
        text: this.editData.text,
        banner_type: this.editData.start_date ? 'timebased' : 'default',
        start_date: this.convertToDateTimeLocal(this.editData.start_date),
        end_date: this.convertToDateTimeLocal(this.editData.end_date),
        status: this.editData.status === 1,
      });
    }
  }

  get f() {
    return this.addMediaForm.controls;
  }

  storeList() {
    this.apiService.getApi("/api/store").subscribe((data: any) => {
      if (data) {
        this.storesList = [
          { store_id: 'all', store_name: 'All Stores' },
          ...data
        ];
      }
    });
  }

  convertToDateTimeLocal(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  formatDate(date: any): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  async save() {
    if (this.addMediaForm.invalid) {
      this.addMediaForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    try {
      let imageUrl = this.editData?.image || null;
      let videoUrl = this.editData?.video || null;
      let PromoimageUrl=this.editData?.promo_banner || null;
      if (this.selectedImageFile) {
        const imgRes: any = await firstValueFrom(
          this.apiService.uploadImage(this.selectedImageFile)
        );
        imageUrl = imgRes?.data?.image_url;
      }
      if (this.selectedpromoImageFile) {
        const imgRes: any = await firstValueFrom(
          this.apiService.uploadImage(this.selectedpromoImageFile)
        );
        PromoimageUrl = imgRes?.data?.image_url;
      }
      if (this.selectedVideoFile) {
        const vidRes: any = await firstValueFrom(
          this.apiService.uploadVideo(this.selectedVideoFile)
        );
        videoUrl = vidRes?.data?.video_url;
      }

      let selectedStores = this.addMediaForm.value.store_id;

      let storeIdString = "";

      if (selectedStores.includes('all')) {
        storeIdString = this.storesList
          .filter(store => store.store_id !== 'all')
          .map(store => store.store_id)
          .join(",");
      } else {
        storeIdString = selectedStores.join(",");
      }

      const loginDetails = JSON.parse(
        this.sessionStorage.getsessionStorage("loginDetails") as any
      );

      const payload: any = {
        type: this.editData ? "Update" : "Insert",
        id: this.editData?.id,
        store_id: storeIdString,
        banner_image_url: imageUrl,
        banner_video_url: videoUrl,
        banner_text: this.addMediaForm.value.text,
        banner_type: this.addMediaForm.value.banner_type,
        start_date: this.addMediaForm.value.banner_type === 'timebased'
          ? this.formatDate(this.addMediaForm.value.start_date)
          : null,
        end_date: this.addMediaForm.value.banner_type === 'timebased'
          ? this.formatDate(this.addMediaForm.value.end_date)
          : null,
        status: this.addMediaForm.value.status ? 1 : 0,
        user_id: loginDetails.user.user_id,
        promo_banner:PromoimageUrl
      };

      const res: any = await firstValueFrom(
        this.apiService.saveBanner(payload)
      );

      this.isSubmitting = false;

      if (res?.code === "1") {
        Swal.fire("Success!", res.message, "success").then(() => {
          this.activeModal.close(true);
        });
      } else {
        Swal.fire("Error", res?.message || "Failed", "error");
      }

    } catch (error: any) {
      this.isSubmitting = false;
      Swal.fire("Error", error?.error?.message || "Upload failed", "error");
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.addMediaForm.patchValue({ image: file });
    }
  }
    onPromoImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedpromoImageFile = file;
      this.addMediaForm.patchValue({ promoBanner: file });
    }
  }

  onVideoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file;
      this.addMediaForm.patchValue({ video: file });
    }
  }
}