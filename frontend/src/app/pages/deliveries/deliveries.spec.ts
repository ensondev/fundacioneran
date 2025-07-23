import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deliveries } from './deliveries';

describe('Deliveries', () => {
  let component: Deliveries;
  let fixture: ComponentFixture<Deliveries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deliveries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deliveries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
