import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDishesComponent } from './inventory-dishes.component';

describe('InventoryDishesComponent', () => {
  let component: InventoryDishesComponent;
  let fixture: ComponentFixture<InventoryDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryDishesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
