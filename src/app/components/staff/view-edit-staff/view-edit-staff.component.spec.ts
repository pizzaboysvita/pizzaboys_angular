import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditStaffComponent } from './view-edit-staff.component';

describe('ViewEditStaffComponent', () => {
  let component: ViewEditStaffComponent;
  let fixture: ComponentFixture<ViewEditStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEditStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
