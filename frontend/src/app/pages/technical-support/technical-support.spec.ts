import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupport } from './technical-support';

describe('TechnicalSupport', () => {
  let component: TechnicalSupport;
  let fixture: ComponentFixture<TechnicalSupport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSupport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
