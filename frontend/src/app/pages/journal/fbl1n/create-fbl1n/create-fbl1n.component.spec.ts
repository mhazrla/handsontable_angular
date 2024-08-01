import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFbl1nComponent } from './create-fbl1n.component';

describe('CreateFbl1nComponent', () => {
  let component: CreateFbl1nComponent;
  let fixture: ComponentFixture<CreateFbl1nComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFbl1nComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFbl1nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
