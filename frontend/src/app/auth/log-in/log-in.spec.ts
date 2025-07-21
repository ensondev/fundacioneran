import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogIn } from './log-in';

describe('LogIn', () => {
  let component: LogIn;
  let fixture: ComponentFixture<LogIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogIn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
