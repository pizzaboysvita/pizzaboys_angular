import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddoptionsetmodalComponent } from './addoptionsetmodal.component';

describe('AddoptionsetmodalComponent', () => {
  let component: AddoptionsetmodalComponent;
  let fixture: ComponentFixture<AddoptionsetmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddoptionsetmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddoptionsetmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
