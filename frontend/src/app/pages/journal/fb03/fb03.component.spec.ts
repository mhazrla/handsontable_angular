import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fb03Component } from './fb03.component';

describe('Fb03Component', () => {
  let component: Fb03Component;
  let fixture: ComponentFixture<Fb03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fb03Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fb03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
