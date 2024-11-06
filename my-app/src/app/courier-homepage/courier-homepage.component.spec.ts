import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierHomepageComponent } from './courier-homepage.component';

describe('CourierHomepageComponent', () => {
  let component:CourierHomepageComponent;
  let fixture: ComponentFixture<CourierHomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourierHomepageComponent]
    });
    fixture = TestBed.createComponent(CourierHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
