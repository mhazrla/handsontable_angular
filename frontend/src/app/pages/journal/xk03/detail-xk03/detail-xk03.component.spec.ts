import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailXk03Component } from './detail-xk03.component';

describe('DetailXk03Component', () => {
  let component: DetailXk03Component;
  let fixture: ComponentFixture<DetailXk03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailXk03Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailXk03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
