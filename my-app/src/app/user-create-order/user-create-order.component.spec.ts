import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateOrderComponent } from './user-create-order.component';

describe('UserCreateOrderComponent', () => {
  let component: UserCreateOrderComponent;
  let fixture: ComponentFixture<UserCreateOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCreateOrderComponent]
    });
    fixture = TestBed.createComponent(UserCreateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
