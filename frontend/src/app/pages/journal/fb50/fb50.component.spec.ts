import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fb50Component } from './fb50.component';

describe('Fb50Component', () => {
  let component: Fb50Component;
  let fixture: ComponentFixture<Fb50Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fb50Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fb50Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
