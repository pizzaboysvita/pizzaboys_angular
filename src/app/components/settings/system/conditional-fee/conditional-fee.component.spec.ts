import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalFeeComponent } from './conditional-fee.component';

describe('ConditionalFeeComponent', () => {
  let component: ConditionalFeeComponent;
  let fixture: ComponentFixture<ConditionalFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionalFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionalFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
