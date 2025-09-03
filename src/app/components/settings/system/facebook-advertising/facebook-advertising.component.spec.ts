import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookAdvertisingComponent } from './facebook-advertising.component';

describe('FacebookAdvertisingComponent', () => {
  let component: FacebookAdvertisingComponent;
  let fixture: ComponentFixture<FacebookAdvertisingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookAdvertisingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookAdvertisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
