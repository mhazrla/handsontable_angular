import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xk03Component } from './xk03.component';

describe('Xk03Component', () => {
  let component: Xk03Component;
  let fixture: ComponentFixture<Xk03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Xk03Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Xk03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
