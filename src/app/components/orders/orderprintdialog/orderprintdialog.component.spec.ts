import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderprintdialogComponent } from './orderprintdialog.component';

describe('OrderprintdialogComponent', () => {
  let component: OrderprintdialogComponent;
  let fixture: ComponentFixture<OrderprintdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderprintdialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderprintdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
