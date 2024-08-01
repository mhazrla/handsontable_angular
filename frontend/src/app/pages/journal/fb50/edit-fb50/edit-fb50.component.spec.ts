import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFb50Component } from './edit-fb50.component';

describe('EditFb50Component', () => {
  let component: EditFb50Component;
  let fixture: ComponentFixture<EditFb50Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFb50Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFb50Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
