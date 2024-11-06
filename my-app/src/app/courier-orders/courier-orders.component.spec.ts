import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierOrdersComponent } from './courier-orders.component';

describe('CourierOrdersComponent', () => {
  let component: CourierOrdersComponent;
  let fixture: ComponentFixture<CourierOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourierOrdersComponent]
    });
    fixture = TestBed.createComponent(CourierOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
