import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDishsComponent } from './add-dishs.component';

describe('AddDishsComponent', () => {
  let component: AddDishsComponent;
  let fixture: ComponentFixture<AddDishsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDishsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDishsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
