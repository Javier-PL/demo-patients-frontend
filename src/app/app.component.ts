import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','../assets/customstyles/dynamic-font.css']
})
export class AppComponent {
  title = 'ccl-frontend';

  constructor(private authenticationService: AuthenticationService,private router: Router) { }

}
