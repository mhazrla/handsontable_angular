import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFb50Component } from './create-fb50.component';

describe('CreateFb50Component', () => {
  let component: CreateFb50Component;
  let fixture: ComponentFixture<CreateFb50Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFb50Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFb50Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
