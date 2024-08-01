import { ComponentFixture, TestBed } from '@angular/core/testing';

import { As03Component } from './as03.component';

describe('As03Component', () => {
  let component: As03Component;
  let fixture: ComponentFixture<As03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ As03Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(As03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
