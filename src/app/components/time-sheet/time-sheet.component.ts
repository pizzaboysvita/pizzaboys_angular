import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
  selector: "app-time-sheet",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgbDatepickerModule,
  ],
  templateUrl: "./time-sheet.component.html",
  styleUrl: "./time-sheet.component.scss",
})
export class TimeSheetComponent implements OnInit {
  activeTab = "login";
  showClock = false;
  selectedDate: any;

  
  pickingMode: "hours" | "minutes" = "hours";
  selectedHour: number = 0;
  selectedMinute: number = 0;
  isPM: boolean = false;
  currentTime: string = "";
  handAngle = 0;
  dragging = false;

  hourNumbers: any[] = [];
  minuteNumbers: any[] = [];

 
  savedData: any = {
    login: { date: null, time: "", hour: 0, minute: 0, period: "" },
    break: { duration: null },
    logout: { date: null, time: "", hour: 0, minute: 0, period: "" },
  };

  breakTimings = [
    { label: "5 mins", value: 5 },
    { label: "15 mins", value: 15 },
    { label: "30 mins", value: 30 },
    { label: "1 hour", value: 60 },
  ];
  selectedBreakTime: any;

  constructor(public modal: NgbModal) {}

  ngOnInit() {
    const now = new Date();

    
    const initialDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
    this.selectedDate = initialDate;

    
    let hours = now.getHours();
    this.isPM = hours >= 12;
    this.selectedHour = hours % 12 || 12;
    this.selectedMinute = now.getMinutes();
    const ampm = this.isPM ? "PM" : "AM";

    
    const initialSelection = {
      date: initialDate,
      time: `${this.selectedHour.toString().padStart(2, "0")}:${this.selectedMinute.toString().padStart(2, "0")} ${ampm}`,
      hour: this.selectedHour,
      minute: this.selectedMinute,
      period: ampm,
    };

    
    this.savedData.login = { ...initialSelection };
    this.savedData.logout = { ...initialSelection };

    
    this.currentTime = initialSelection.time;
    this.handAngle = (this.selectedHour % 12) * 30;

    this.generateClockArrays();
  }

  generateClockArrays() {
    this.hourNumbers = [];
    for (let i = 1; i <= 12; i++) {
      this.hourNumbers.push({ value: i.toString(), angle: i * 30 });
    }
    this.minuteNumbers = [];
    for (let i = 0; i < 60; i += 5) {
      this.minuteNumbers.push({
        value: i.toString().padStart(2, "0"),
        angle: i * 6,
      });
    }
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.showClock = false; 

    if (tab === "login" || tab === "logout") {
      const data = this.savedData[tab];
      this.selectedDate = data.date;
      this.selectedHour = data.hour;
      this.selectedMinute = data.minute;
      this.isPM = data.period === "PM";
      this.currentTime = data.time;

      this.setPickingMode("hours"); 
    }
  }

  selectDate(date: any) {
    this.selectedDate = date;
    this.showClock = true;
    this.syncHeaderTime();
  }

  setPickingMode(mode: "hours" | "minutes") {
    this.pickingMode = mode;
    this.handAngle =
      mode === "hours"
        ? (this.selectedHour % 12) * 30
        : this.selectedMinute * 6;
  }

  toggleAMPM(isPM: boolean) {
    this.isPM = isPM;
    this.syncHeaderTime();
  }

  syncHeaderTime() {
    const hr = this.selectedHour.toString().padStart(2, "0");
    const min = this.selectedMinute.toString().padStart(2, "0");
    const ampm = this.isPM ? "PM" : "AM";
    this.currentTime = `${hr}:${min} ${ampm}`;

    if (this.activeTab === "login" || this.activeTab === "logout") {
      this.savedData[this.activeTab] = {
        date: this.selectedDate,
        time: this.currentTime,
        hour: this.selectedHour,
        minute: this.selectedMinute,
        period: ampm,
      };
    }
  }

  rotateHand = (event: MouseEvent) => {
    if (!this.dragging) return;
    const clock = document.querySelector(".clock") as HTMLElement;
    const rect = clock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle =
      (Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180) /
      Math.PI;
    angle += 90;
    if (angle < 0) angle += 360;

    if (this.pickingMode === "hours") {
      let hour = Math.round(angle / 30);
      this.selectedHour = hour === 0 ? 12 : hour;
      this.handAngle = (this.selectedHour % 12) * 30;
    } else {
      let minute = Math.round(angle / 6);
      this.selectedMinute = minute === 60 ? 0 : minute;
      this.handAngle = this.selectedMinute * 6;
    }
    this.syncHeaderTime();
  };

  startDrag(event: MouseEvent) {
    event.preventDefault();
    this.dragging = true;
    document.addEventListener("mousemove", this.rotateHand);
    document.addEventListener("mouseup", this.stopDrag);
  }

  stopDrag = () => {
    if (this.dragging && this.pickingMode === "hours") {
      setTimeout(() => this.setPickingMode("minutes"), 300);
    }
    this.dragging = false;
    document.removeEventListener("mousemove", this.rotateHand);
    document.removeEventListener("mouseup", this.stopDrag);
  };

  saveTime() {
    this.savedData.break.duration = this.selectedBreakTime;
    const finalPayload = {
      login: this.savedData.login,
      break: this.savedData.break,
      logout: this.savedData.logout,
      submittedAt: new Date().toLocaleString(),
    };
    console.log("Final Data:", finalPayload);
    this.modal.dismissAll();
  }

  getMonthName(month: number | undefined) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return month ? months[month - 1] : "";
  }
}
