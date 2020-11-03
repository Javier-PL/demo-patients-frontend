import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class PatientsService {



  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }



  getDBpatients() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.get(this.authenticationService.ENVVARS.API_URL + '/patients/g', { headers: headers })
  }

  postDBpatients(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/patient/c', body, { headers: headers })
  }

  updateDBpatients(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/patient/u', body, { headers: headers })
  }

  /* //NOT USED
  deleteDBpatient(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/patient/d', body, { headers: headers })
  }
  */

}
