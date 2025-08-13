import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPurchaseChartComponent } from './sales-purchase-chart.component';

describe('SalesPurchaseChartComponent', () => {
  let component: SalesPurchaseChartComponent;
  let fixture: ComponentFixture<SalesPurchaseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPurchaseChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesPurchaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
