import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-admin-homepage',
  templateUrl: './admin-homepage.component.html',
  styleUrls: ['./admin-homepage.component.css']
})
export class AdminHomepageComponent {


  constructor(private authService: AuthService) {
  }

  getUsername() {
    return this.authService.getUsername();
  }
}


