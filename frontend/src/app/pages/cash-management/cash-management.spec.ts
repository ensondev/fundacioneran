import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashManagement } from './cash-management';

describe('CashManagement', () => {
  let component: CashManagement;
  let fixture: ComponentFixture<CashManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
