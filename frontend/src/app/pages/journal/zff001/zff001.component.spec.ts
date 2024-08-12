import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zff001Component } from './zff001.component';

describe('Zff001Component', () => {
  let component: Zff001Component;
  let fixture: ComponentFixture<Zff001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Zff001Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Zff001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
