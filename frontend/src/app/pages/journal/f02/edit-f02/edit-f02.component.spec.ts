import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditF02Component } from './edit-f02.component';

describe('EditF02Component', () => {
  let component: EditF02Component;
  let fixture: ComponentFixture<EditF02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditF02Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditF02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
