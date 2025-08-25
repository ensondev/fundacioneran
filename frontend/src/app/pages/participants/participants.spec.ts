import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Participants } from './participants';

describe('Participants', () => {
  let component: Participants;
  let fixture: ComponentFixture<Participants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Participants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Participants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
