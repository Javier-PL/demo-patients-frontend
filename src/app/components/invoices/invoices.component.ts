
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common'
import { MatTableDataSource, MatTable, MatSort, MatPaginator, MatDialog } from '../../../../node_modules/@angular/material';

//Services
import { ExcelService } from '../../services/excel.service';
import { PdfService } from '../../services/pdf.service';
import { InvoicesService } from '../../services/invoices.service';
import { SnackbarService } from '../../services/snackbar.service';

//Datapicker
import { MAT_DATE_FORMATS, DateAdapter } from 'saturn-datepicker';
import {  DateAdapterComponent, MY_DATE_FORMATS  } from './format-datepiecker';

//Dialog
import { EditdialogComponent } from '../editdialog/editdialog.component';

//Models
import { Invoice } from 'src/app/models/invoice';



@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css', '../../../assets/customstyles/dynamic-font.css'],
  providers: [
    {provide: DateAdapter, useClass: DateAdapterComponent},
     {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class InvoicesComponent implements OnInit {

  theDateRange
  //rangesFooter = RangesFooter;
  //inlineRange;

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['select','invoice_number', 'date', 'patient', 'desc',  'retention','units', 'price', 'total', 'payed'];
  displayedColumnsHeaders: string[] = ['Factura N°', 'Fecha', 'Nombre', 'Descripción', 'Unidades', 'Precio Unitario (€)', 'Total (€)', 'Retención (%)', 'Pagado (€)']

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: true }) tableX: ElementRef;

  //Not used anymore //name of the excel-file which will be downloaded
  fileName = 'ExcelSheet.xlsx';


  constructor(private invoicesService: InvoicesService, private excelService: ExcelService, private pdfService: PdfService, public datepipe: DatePipe, private snackbarService: SnackbarService,public dialog: MatDialog) {

    //Initialise datepicker
    var startdate = new Date();
    startdate.setDate(startdate.getDate()-6);
    this.theDateRange = { 'begin':startdate, 'end': new Date() };

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
   

    const params = {
      from: this.datepipe.transform(this.theDateRange.begin, 'yyyy-MM-dd') + "T00:00:00.000+00:00",
      to: this.datepipe.transform(this.theDateRange.end, 'yyyy-MM-dd') + "T00:00:00.000+00:00"
    }
    this.invoicesService.getInvoicesRange(params).subscribe((data: any) => {

      if (data == null) {
        data = []
        this.snackbarService.openSnackBar(this.snackbarService.msgInvoicesNotFound, this.snackbarService.msgClose)
      }

      this.dataSource = new MatTableDataSource(data)
      this.table.renderRows();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    }, err => { console.log(err); this.snackbarService.openSnackBar(this.snackbarService.msgSyncError, this.snackbarService.msgClose) })
  }

  retrieveRangeInvoices(event: any) {
    
    if(event!=null){
      this.theDateRange = event.target.value;
    }
    
    const params = {
      from: this.datepipe.transform(this.theDateRange.begin, 'yyyy-MM-dd') + "T00:00:00.000+00:00",
      to: this.datepipe.transform(this.theDateRange.end, 'yyyy-MM-dd') + "T00:00:00.000+00:00"
    }
    this.invoicesService.getInvoicesRange( params).subscribe((data: any) => {

      if (data == null) {
        data = []
        this.snackbarService.openSnackBar(this.snackbarService.msgInvoicesNotFound, this.snackbarService.msgClose)
      }

      this.dataSource = new MatTableDataSource(data)
      this.table.renderRows();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    }, err => { 
      console.log(err); 
      this.snackbarService.openSnackBar(this.snackbarService.msgSyncError, this.snackbarService.msgClose) 
    })
  }


  getTotalPayment() {
    return this.dataSource.data.map((t: Invoice) => t.payed).reduce((acc, value) => acc + value, 0);
  }

  getTotalExpectedPayment() {
    return this.dataSource.data.map((t: Invoice) => (t.units * t.price) - (t.units * t.price * t.retention/100)).reduce((acc, value) => acc + value, 0);
  }
  
  
//Not in use anymore
  exportexcel(): void {
    this.excelService.exportAsExcelFile(this.dataSource.data, this.displayedColumnsHeaders, 'Facturacion_Fisioterapia_CL');
  }

  createInvoicePDF(invoice:Invoice){
    
    let name = "Clínica_CL_Factura_" + invoice.patient + "_"+  this.datepipe.transform(invoice.date, 'dd-MM-yyyy')
    this.pdfService.CreatePatientInvoicePDF(invoice).subscribe(response => {
      try {
        let isFileSaverSupported = !!new Blob;
      } catch (e) {
        console.log(e);
        return;
      }
      let blob = new Blob([response], { type: 'application/pdf;charset=utf-8' });
      var fileURL = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = fileURL;
      anchor.download = name + ".pdf";
      document.body.appendChild(anchor); //For Firefox
      anchor.click();
      //It's better to remove the elem
      document.body.removeChild(anchor);
    });
  }

  exportpdf(): void {

    const invoicesData = this.dataSource.data

    console.log(invoicesData)

    let name = "Facturación_Clínica_CL_" + this.datepipe.transform(this.theDateRange.begin, 'dd-MM-yyyy') + "_a_" +  this.datepipe.transform(this.theDateRange.end, 'dd-MM-yyyy')
    this.pdfService.createPDF(invoicesData).subscribe(response => {
      try {
        let isFileSaverSupported = !!new Blob;
      } catch (e) {
        console.log(e);
        return;
      }
      let blob = new Blob([response], { type: 'application/pdf;charset=utf-8' });
      var fileURL = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = fileURL;
      anchor.download = name + ".pdf";
      document.body.appendChild(anchor); //For FF
      anchor.click();
      //It's better to remove the elem
      document.body.removeChild(anchor);
    });


  }


  /*Dialog functions*/ 
  
  updateInvoice(updateInvoice:Invoice) {

    let searchparam = updateInvoice.ID
    let body = updateInvoice

    this.invoicesService.updateDBinvoice(searchparam, body).subscribe((data: any) => {

      this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceModifyOK, this.snackbarService.msgClose)
      this.retrieveRangeInvoices(null) 

    }, err => { console.log(err); this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceModifyError, this.snackbarService.msgClose) })

  }

  openEditInvoiceDialog(invoice:Invoice): void {

    //WORKAROUND: because  <input matInput type="date" [(ngModel)]="data.date"> only accepts the 'yyyy-MM-dd' format
    invoice.date = this.datepipe.transform(invoice.date, 'yyyy-MM-dd')  

    const dialogRef = this.dialog.open(EditdialogComponent, {
      width: '30vw',
      height: '36vw',
      data: invoice
    });

    dialogRef.afterClosed().subscribe(resultInvoice => {
      //reverse workaround

      if (resultInvoice!=null){
        resultInvoice.date = resultInvoice.date  + "T00:00:00.000+00:00"

      this.updateInvoice(resultInvoice)
      this.dialog
      }else{
        invoice.date + "T00:00:00.000+00:00"
      }     

    });
  }


}

