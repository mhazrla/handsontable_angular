import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fbl1nComponent } from './fbl1n.component';

describe('Fbl1nComponent', () => {
  let component: Fbl1nComponent;
  let fixture: ComponentFixture<Fbl1nComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fbl1nComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fbl1nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
