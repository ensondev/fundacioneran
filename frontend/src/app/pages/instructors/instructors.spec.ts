import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Instructors } from './instructors';

describe('Instructors', () => {
  let component: Instructors;
  let fixture: ComponentFixture<Instructors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Instructors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Instructors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
