import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMade } from './sales-made';

describe('SalesMade', () => {
  let component: SalesMade;
  let fixture: ComponentFixture<SalesMade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMade]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesMade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
