import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fb60Component } from './fb60.component';

describe('Fb60Component', () => {
  let component: Fb60Component;
  let fixture: ComponentFixture<Fb60Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fb60Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fb60Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
