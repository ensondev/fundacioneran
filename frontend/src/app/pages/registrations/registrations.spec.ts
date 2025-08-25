import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registrations } from './registrations';

describe('Registrations', () => {
  let component: Registrations;
  let fixture: ComponentFixture<Registrations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registrations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registrations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
