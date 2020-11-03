import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../../../node_modules/rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {



  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  createPDF(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN }); 
    return this.http.post<any>(this.authenticationService.ENVVARS.API_URL + '/invoices/historial_pdf', body, { responseType: 'arraybuffer' as 'json',headers: headers })
  }

  CreatePatientInvoicePDF(body) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.authenticationService.TOKEN }); 
    return this.http.post<any>(this.authenticationService.ENVVARS.API_URL + '/invoices/invoice_pdf', body, { responseType: 'arraybuffer' as 'json',headers: headers })
  }

}
