import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatAdjustmentComponent } from './float-adjustment.component';

describe('FloatAdjustmentComponent', () => {
  let component: FloatAdjustmentComponent;
  let fixture: ComponentFixture<FloatAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatAdjustmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
