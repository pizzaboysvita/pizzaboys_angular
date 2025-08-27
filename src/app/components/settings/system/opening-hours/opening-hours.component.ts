import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-opening-hours',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.scss'],
})
export class OpeningHoursComponent {
  activeService = 1; 


  regularHours = [
    { day: 'Monday', open: '10:30', close: '22:00', is24Hour: false },
    { day: 'Tuesday', open: '10:30', close: '22:00', is24Hour: false },
    { day: 'Wednesday', open: '10:30', close: '22:00', is24Hour: false },
    { day: 'Thursday', open: '10:30', close: '22:00', is24Hour: false },
    { day: 'Friday', open: '10:30', close: '22:00', is24Hour: false },
    { day: 'Saturday', open: '10:30', close: '22:00', is24Hour: false },
    { day: 'Sunday', open: '10:30', close: '22:00', is24Hour: false },
  ];
}