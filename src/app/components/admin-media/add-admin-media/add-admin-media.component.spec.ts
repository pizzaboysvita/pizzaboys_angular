import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminMediaComponent } from './add-admin-media.component';

describe('AddAdminMediaComponent', () => {
  let component: AddAdminMediaComponent;
  let fixture: ComponentFixture<AddAdminMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAdminMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdminMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
