import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleToPermissionComponent } from './role-to-permission.component';

describe('RoleToPermissionComponent', () => {
  let component: RoleToPermissionComponent;
  let fixture: ComponentFixture<RoleToPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleToPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleToPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
