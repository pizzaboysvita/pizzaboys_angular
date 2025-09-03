import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentsComponent } from './order-payments.component';

describe('OrderPaymentsComponent', () => {
  let component: OrderPaymentsComponent;
  let fixture: ComponentFixture<OrderPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
