import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { ErrorStateMatcher } from '../../../../node_modules/@angular/material';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from "@angular/router"
import { Token } from 'src/app/models/token';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../assets/customstyles/dynamic-font.css']
})
export class LoginComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  loginForm: FormGroup;
  isLoginFailed: boolean

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {

    if (this.authenticationService.isAuthorised === true) {
      this.router.navigate(['/patients'])
    }

    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });

    //this.authenticationService.ENVVARS.AUTH_API_URL = "http://localhost:8080" //"https://fcl-auth-api.herokuapp.com"
    //this.authenticationService.ENVVARS.API_URL = "http://localhost:8081" //"https://fcl-api-test.herokuapp.com"

  }

  login() {
    //this.loginForm.value
    this.authenticationService.authenticate(this.loginForm.value).subscribe((data: Token) => {

      this.authenticationService.TOKEN = data.token
      if(this.authenticationService.TOKEN.length>0) this.authenticationService.TOKENINFO = JSON.parse(atob(this.authenticationService.TOKEN.split('.')[1]))
      //console.log(Date.now()/1000,this.authenticationService.TOKENINFO.exp,Date.now()/1000 > this.authenticationService.TOKENINFO.exp)
      this.authenticationService.isAuthorised = true
      this.isLoginFailed = false
      this.router.navigate(['/patients'])
      
    }, err => {
      console.log(err)
      this.isLoginFailed = true

    })
  }

}

