import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateF02Component } from './create-f02.component';

describe('CreateF02Component', () => {
  let component: CreateF02Component;
  let fixture: ComponentFixture<CreateF02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateF02Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateF02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
