import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFb60Component } from './create-fb60.component';

describe('CreateFb60Component', () => {
  let component: CreateFb60Component;
  let fixture: ComponentFixture<CreateFb60Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFb60Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFb60Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
