import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  ENVIRONMENT: string = "local" //local //prod //cloudtest
  //ENVVARS: ENVVARS = { AUTH_API_URL: "http://localhost:8080", API_URL: "http://localhost:8081" }
  //ENVVARS: ENVVARS = { AUTH_API_URL: "https://fcl-auth-api.herokuapp.com", API_URL: "https://fcl-api-test.herokuapp.com" }

  ENVVARS: ENVVARS = { AUTH_API_URL: "https://ccl-auth-api.herokuapp.com", API_URL: "https://ccl-patients-api.herokuapp.com" } //CCL TEST
  //ENVVARS: ENVVARS = { AUTH_API_URL: "https://ccl-auth-api.herokuapp.com", API_URL: "http://localhost:8081" } //CCL TEST

  TOKEN: string = ''
  isAuthorised: boolean = false
  TOKENINFO: TOKENINFO = { }

  
  constructor(private http: HttpClient) { }

  authenticate(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });  
    return this.http.post(this.ENVVARS.AUTH_API_URL + '/token-auth', body, { headers: headers })
  }

  isTokenExpired(){
    if(Date.now()/1000 > this.TOKENINFO.exp){
      //expired //TODO
    }
  }

  signOut(){
    this.TOKEN = ''
    this.isAuthorised = false
    this.TOKENINFO =  { }
  }
}


export interface ENVVARS {
  AUTH_API_URL?: string
  API_URL?: string
}

export interface TOKENINFO{
  exp?: number
  role?: string
  iat?:number
  sub?:string
}