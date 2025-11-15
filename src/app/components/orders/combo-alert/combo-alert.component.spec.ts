import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboAlertComponent } from './combo-alert.component';

describe('ComboAlertComponent', () => {
  let component: ComboAlertComponent;
  let fixture: ComponentFixture<ComboAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
