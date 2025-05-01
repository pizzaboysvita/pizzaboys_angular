import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSummaryChartComponent } from './sales-summary-chart.component';

describe('SalesSummaryChartComponent', () => {
  let component: SalesSummaryChartComponent;
  let fixture: ComponentFixture<SalesSummaryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesSummaryChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesSummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
