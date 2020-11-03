import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {


  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getInvoiceNumber() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.get(this.authenticationService.ENVVARS.API_URL + '/invoice/number', { headers: headers })
  }
  
  /* //UNUSED
  getDBinvoice(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/invoice/g', body, { headers: headers })
  }*/

  getInvoiceByInvoiceNumber(searchparam) {
    let params = new HttpParams().set("invoice_number",searchparam)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.get(this.authenticationService.ENVVARS.API_URL + '/invoice/g/invoice_number', { headers: headers, params: params })
  }

  getDBinvoices(searchparam) {
    let params = new HttpParams().set("patientID",searchparam)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.get(this.authenticationService.ENVVARS.API_URL + '/invoices/g', { headers: headers, params: params })
  }

  getInvoicesRange(params) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.get(this.authenticationService.ENVVARS.API_URL + '/invoices/g/range', { headers: headers, params: params })
  }

  postDBinvoices(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/invoice/c', body, { headers: headers })
  }

  /*
  updateDBinvoice(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/invoice/u', body, { headers: headers })
  }*/

  updateDBinvoice(searchparam, body) {
    let params = new HttpParams().set("ID",searchparam)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.put(this.authenticationService.ENVVARS.API_URL + '/invoice/u', body, { headers: headers, params: params  })
  }

  updateDBinvoices(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/invoices/u', body, { headers: headers })
  }

  /* //NOT USED
  deleteDBinvoice(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN });  
    return this.http.post(this.authenticationService.ENVVARS.API_URL + '/invoice/d', body, { headers: headers })
  }
  */

}
