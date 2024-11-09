import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-user-homepage',
  templateUrl: './user-homepage.component.html',
  styleUrls: ['./user-homepage.component.css']
})
export class UserHomepageComponent {
  constructor(private authService: AuthService) {
  }

  getUsername() {
    return this.authService.getUsername();
  }

}
