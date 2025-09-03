import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieptPrinterComponent } from './reciept-printer.component';

describe('RecieptPrinterComponent', () => {
  let component: RecieptPrinterComponent;
  let fixture: ComponentFixture<RecieptPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecieptPrinterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecieptPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
