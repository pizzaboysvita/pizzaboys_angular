import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakingsCashComponent } from './takings-cash.component';

describe('TakingsCashComponent', () => {
  let component: TakingsCashComponent;
  let fixture: ComponentFixture<TakingsCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakingsCashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakingsCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
