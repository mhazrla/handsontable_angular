import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFb60Component } from './edit-fb60.component';

describe('EditFb60Component', () => {
  let component: EditFb60Component;
  let fixture: ComponentFixture<EditFb60Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFb60Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFb60Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
