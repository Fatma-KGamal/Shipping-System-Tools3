import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-courier-home',
  templateUrl: './courier-homepage.component.html',
  styleUrls: ['./courier-homepage.component.css']
})
export class CourierHomepageComponent {
  constructor(private authService: AuthService) {
  }

  getUsername() {
    return this.authService.getUsername();
  }


}
