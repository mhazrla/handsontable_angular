import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Yaioff003Component } from './yaioff003.component';

describe('Yaioff003Component', () => {
  let component: Yaioff003Component;
  let fixture: ComponentFixture<Yaioff003Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Yaioff003Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Yaioff003Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
