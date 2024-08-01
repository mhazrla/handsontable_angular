import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F02Component } from './f02.component';

describe('F02Component', () => {
  let component: F02Component;
  let fixture: ComponentFixture<F02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F02Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(F02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
