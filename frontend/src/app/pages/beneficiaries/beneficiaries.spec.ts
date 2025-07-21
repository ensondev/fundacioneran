import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Beneficiaries } from './beneficiaries';

describe('Beneficiaries', () => {
  let component: Beneficiaries;
  let fixture: ComponentFixture<Beneficiaries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Beneficiaries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Beneficiaries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
