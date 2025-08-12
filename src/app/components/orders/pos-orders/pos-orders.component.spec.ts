import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosOrdersComponent } from './pos-orders.component';

describe('PosOrdersComponent', () => {
  let component: PosOrdersComponent;
  let fixture: ComponentFixture<PosOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
