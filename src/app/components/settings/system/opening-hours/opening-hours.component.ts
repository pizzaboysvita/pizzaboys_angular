import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { SettingsService } from "../../settings.service";

@Component({
  selector: "app-opening-hours",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    DragDropModule,
  ],
  templateUrl: "./opening-hours.component.html",
  styleUrls: ["./opening-hours.component.scss"],
})
export class OpeningHoursComponent implements OnInit {
  activeService: "general" | "pickup" | "delivery" = "general";

  form = this.fb.group({
    general: this.fb.array([]),
    pickup: this.fb.array([]),
    delivery: this.fb.array([]),
    special: this.fb.array([]),
  });

  days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  storeId = 33;

  loading = false;
  error = "";

  constructor(private fb: FormBuilder, private settings: SettingsService) {}

  ngOnInit(): void {
    ["general", "pickup", "delivery"].forEach((t: any) => this.initDefaults(t));

    this.loadFromApi();
  }

  // ---------------- form array getters ----------------
  getGeneral(): FormArray {
    return this.form.get("general") as FormArray;
  }
  getPickup(): FormArray {
    return this.form.get("pickup") as FormArray;
  }
  getDelivery(): FormArray {
    return this.form.get("delivery") as FormArray;
  }
  getSpecial(): FormArray {
    return this.form.get("special") as FormArray;
  }

  getSlotsArray(type: "general" | "pickup" | "delivery"): FormArray {
    return this.form.get(type) as FormArray;
  }

  // ---------------- create slot factories ----------------
  private createSlotGroup(data?: any): FormGroup {
    return this.fb.group({
      day: [data?.day ?? "Monday"],
      from: [data?.from ?? "10:30"],
      to: [data?.to ?? "22:00"],
      is24Hour: [!!data?.is24Hour],
    });
  }

  private createSpecialGroup(data?: any): FormGroup {
    return this.fb.group({
      date: [data?.date ?? ""], // yyyy-mm-dd string
      from: [data?.from ?? "09:00"],
      to: [data?.to ?? "17:00"],
      isAllDay: [!!data?.isAllDay],
    });
  }

  private initDefaults(type: "general" | "pickup" | "delivery") {
    const arr = this.getSlotsArray(type);
    if (arr.length) return;
    this.days.forEach((day) =>
      arr.push(this.createSlotGroup({ day, from: "09:00", to: "17:00" }))
    );
  }

  // ---------------- API load ----------------
  loadFromApi(): void {
    this.loading = true;
    this.settings.getWorkingHours(this.storeId).subscribe({
      next: (data) => {
        ["general", "pickup", "delivery"].forEach((t: any) => {
          const arr = this.getSlotsArray(t);
          arr.clear();
        });
        this.getSpecial().clear();

        (data || []).forEach((item: any) => {
          const isSpecial = !!item.special;
          const type = (item.type || "general") as
            | "general"
            | "pickup"
            | "delivery"
            | "special";
          if (isSpecial) {
            this.getSpecial().push(this.createSpecialGroup({ ...item }));
          } else {
            const arr = this.getSlotsArray(
              type as "general" | "pickup" | "delivery"
            );
            arr.push(this.createSlotGroup({ ...item }));
          }
        });

        ["general", "pickup", "delivery"].forEach((t: any) => {
          const arr = this.getSlotsArray(t);
          if (arr.length === 0) this.initDefaults(t);
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Failed to load working hours";
        this.loading = false;
      },
    });
  }

  // ---------------- slot operations (reactive) ----------------
  addSlot(type: "general" | "pickup" | "delivery") {
    this.getSlotsArray(type).push(this.createSlotGroup());
  }

  copySlot(type: "general" | "pickup" | "delivery", index: number) {
    const arr = this.getSlotsArray(type);
    const val = arr.at(index).value;
    arr.insert(index + 1, this.createSlotGroup({ ...val }));
  }

  removeSlot(type: "general" | "pickup" | "delivery", index: number) {
    this.getSlotsArray(type).removeAt(index);
  }

  dropSlots(
    event: CdkDragDrop<any[]>,
    type: "general" | "pickup" | "delivery"
  ) {
    const arr = this.getSlotsArray(type);
    moveItemInArray(arr.controls, event.previousIndex, event.currentIndex);
    arr.updateValueAndValidity();
  }

  // ---------------- special hours operations ----------------
  addSpecial(typeFor?: "general" | "pickup" | "delivery") {
    this.getSpecial().push(this.createSpecialGroup({}));
  }

  copySpecial(index: number) {
    const val = this.getSpecial().at(index).value;
    this.getSpecial().insert(index + 1, this.createSpecialGroup({ ...val }));
  }

  removeSpecial(index: number) {
    this.getSpecial().removeAt(index);
  }

  dropSpecial(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.getSpecial().controls,
      event.previousIndex,
      event.currentIndex
    );
    this.getSpecial().updateValueAndValidity();
  }

  // ---------------- saving: map to API format and POST ----------------
 saveAll(): void {
  const merged: any[] = [];

  ["general", "pickup", "delivery"].forEach((t: any) => {
    const arr = this.getSlotsArray(t);
    arr.controls.forEach((ctrl) => {
      const v = ctrl.value;
      merged.push({
        type: t,
        day: v.day,
        from: v.from,
        to: v.to,
        is24Hour: !!v.is24Hour,
        special: false,
      });
    });
  });

  this.getSpecial().controls.forEach((ctrl) => {
    const v = ctrl.value;
    merged.push({
      type: v.type ?? "general",
      date: v.date,
      from: v.from,
      to: v.to,
      isAllDay: !!v.isAllDay,
      special: true,
    });
  });

  // ✅ Log the payload to debug
  console.log("Final merged payload:", merged);

  this.settings.updateWorkingHours(this.storeId, merged).subscribe({
    next: (res) => {
      alert("Working hours saved successfully");
      this.loadFromApi();
    },
    error: (err) => {
      console.error("API error:", err);
      this.error = "Failed to save working hours";
    },
  });
}


  // ✅ Return slots for current service, cast as FormGroup[]
  getSlots(type: "general" | "pickup" | "delivery"): FormGroup[] {
    return this.getSlotsArray(type).controls as FormGroup[];
  }

  // ✅ Return special slots, cast as FormGroup[]
  getSpecials(): FormGroup[] {
    return this.getSpecial().controls as FormGroup[];
  }
}
