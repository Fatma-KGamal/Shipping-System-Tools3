import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierOrderDetailComponent } from './courier-order-detail.component';

describe('CourierOrderDetailComponent', () => {
  let component: CourierOrderDetailComponent;
  let fixture: ComponentFixture<CourierOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourierOrderDetailComponent]
    });
    fixture = TestBed.createComponent(CourierOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
