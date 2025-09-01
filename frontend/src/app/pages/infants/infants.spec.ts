import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Infants } from './infants';

describe('Infants', () => {
  let component: Infants;
  let fixture: ComponentFixture<Infants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Infants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Infants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
