import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject, ElementRef } from '@angular/core';
import { PatientsService } from '../../services/patients.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm, AbstractControl } from '../../../../node_modules/@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ErrorStateMatcher, MatTable, MatSort, MatTableDataSource, MatPaginator,  MatDialog } from '../../../../node_modules/@angular/material';
import { InvoicesService } from '../../services/invoices.service';
import { SnackbarService } from '../../services/snackbar.service';
import { DatePipe } from '../../../../node_modules/@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PdfService } from 'src/app/services/pdf.service';
import { EditdialogComponent } from '../editdialog/editdialog.component';
import { Invoice } from 'src/app/models/invoice';
import { SearchType } from 'src/app/models/searchtype';
import { Patient } from 'src/app/models/patient';
import { DateValidator, InputValidator } from 'src/app/validators/custom.validators';


export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};


/** Error when the parent is invalid */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css', '../../../assets/customstyles/dynamic-font.css',]
})




export class PatientsComponent implements OnInit {

  disableButtons:boolean = false //helper to disable buttons triggering http calls so if double click happens they cause no duplicates
  invoiceNumber:number = 0 //just to display the invoicenumber, no data transfer

  matcher = new MyErrorStateMatcher();

  patients: Patient[] = []
  addPatientForm: FormGroup;
  updatePatientForm: FormGroup;
  formInvoices: FormGroup;
  searchControl = new FormControl();

 
  
  filteredPatients: Observable<Patient[]>;
  searchtypes: SearchType[] = [
    { value: 'fullname', viewValue: 'Nombre' },
    { value: 'dni', viewValue: 'DNI' }
  ];
  selectedSearchType: string = "fullname"
  selectedPatient: Patient = null 
  showAddInvoice: boolean = false
  showAddPatient: boolean = false
  showAddOrg: boolean = false
  showInvoicesTable: boolean = false
  showUpdatePatient: boolean = false
  showDetails: boolean = false

  foundInvoice:Invoice = {}
  searchInvoice:number = null
  isFoundInvoice:boolean = false

  displayedColumns: string[] = ['select','invoice_number', 'date', 'desc', 'retention','units', 'price', 'total',  'payed'];
  //datasource: any = []

  datasource = new MatTableDataSource();

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(private patientsService: PatientsService, private invoicesService: InvoicesService, private snackbarService: SnackbarService, private pdfService:PdfService, private authenticationService: AuthenticationService,public datepipe: DatePipe,public dialog: MatDialog) { }


  

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;

  }


  ngOnInit() {

    this.addPatientForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl(null),
      dni: new FormControl(null),
      email: new FormControl(null),
      address: new FormControl(null),
      phone: new FormControl(null)
    });

    this.updatePatientForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl(null),
      dni: new FormControl(null),
      email: new FormControl(null),
      address: new FormControl(null),
      phone: new FormControl(null)
    });

    this.formInvoices = new FormGroup({
      units: new FormControl(0,[InputValidator]),
      price: new FormControl(0,[InputValidator]),
      retention: new FormControl(0,[InputValidator]),
      payed: new FormControl(0,[InputValidator]),
      desc: new FormControl(''),
      date: new FormControl(new Date().toJSON().split("T")[0],[DateValidator]),
    });


    this.patientsService.getDBpatients().subscribe((data: Patient[]) => {
      if (data != null) this.patients = data;


      this.patients.sort(function(a, b) {
        return a.fullname.localeCompare(b.fullname);
     });

      this.filteredPatients = this.searchControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.fullname),
          map(fullname => fullname ? this._filter(fullname) : this.patients.slice())
        );

        
        


    }, err => console.log(err))

    this.searchControl.valueChanges.subscribe(value => {

      if(typeof value !== "string"){
        this.selectedPatient = value
      }
    });

    this.invoicesService.getInvoiceNumber().subscribe((data: any) => { 
      this.invoiceNumber = data.InvoiceNumber
    }, err=>{console.log(err)})

  }

  addPatient(isOrg: boolean) {

    this.disableButtons=true

    let patientData = this.addPatientForm.value

    this.createFullnameAttribute(patientData)

    if (isOrg == true) {
      patientData.isorg = true
    }


    this.patientsService.postDBpatients(this.cleanObject(this.addPatientForm.value)).subscribe((data: any) => {


      this.patientsService.getDBpatients().subscribe((data: Patient[]) => {
       if (data != null) this.patients = data;

        this.patients.sort(function(a, b) {
          return a.fullname.localeCompare(b.fullname);
       });

        this.addPatientForm.reset()


        this.clearPatientSearch() //to trigger valueChanges

        if (isOrg == false) {
          this.snackbarService.openSnackBar( this.snackbarService.msgPatientOK, this.snackbarService.msgClose)
        } else {
          this.snackbarService.openSnackBar(this.snackbarService.msgOrgOK, this.snackbarService.msgClose)
        }

        this.disableButtons=false


      }, err => { 
        console.log(err); 
        this.snackbarService.openSnackBar(this.snackbarService.msgSyncError, this.snackbarService.msgClose);
        this.disableButtons=false 
      })

    }, err => {
      console.log(err);
      if (isOrg == false) {
        this.snackbarService.openSnackBar(this.snackbarService.msgPatientError, this.snackbarService.msgClose)
      } else {
        this.snackbarService.openSnackBar(this.snackbarService.msgOrgError, this.snackbarService.msgClose)
      }
      this.snackbarService.openSnackBar(this.snackbarService.msgSyncError, this.snackbarService.msgClose)
      this.disableButtons=false

    })

  }

  

  addInvoice() {

    this.disableButtons=false


    this.formInvoices.value.patient = this.selectedPatient.fullname
    this.formInvoices.value.patientid = this.selectedPatient.ID
    this.formInvoices.value.patientdni = this.selectedPatient.dni
    this.formInvoices.value.patientaddress =  this.selectedPatient.address

    if (this.selectedPatient.isorg == true) {
      this.formInvoices.value.isorg = true
      //this.formInvoices.value.patientaddress =  this.searchControl.value.address
    } /*else {
      this.formInvoices.value.patientdni = this.searchControl.value.dni
    }*/


    this.formInvoices.value.date = new Date(this.formInvoices.value.date);

    if(typeof this.selectedPatient !== 'object'){
      this.snackbarService.openSnackBar(this.snackbarService.msgSelectError, this.snackbarService.msgClose)
      this.disableButtons=false
      return 
    }

    this.invoicesService.postDBinvoices(this.cleanObject(this.formInvoices.value)).subscribe((data: any) => {

      
        this.retrieveInvoices()
        this.formInvoices.reset(this.initInvoiceForm()) 
        this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceOK, this.snackbarService.msgClose)
        this.disableButtons=false

        this.invoicesService.getInvoiceNumber().subscribe((data: any) => { this.invoiceNumber = data.InvoiceNumber}, err=>{console.log(err)})


    }, err => { 
      console.log(err); 
      this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceError, this.snackbarService.msgClose); 
      this.disableButtons=false 
    })

  }

  


 

  retrieveInvoices() {


    if (this.showInvoicesTable === true) {



      this.searchControl.value.invoicesDB = []

      

      this.invoicesService.getDBinvoices(this.selectedPatient.ID).subscribe((data: Invoice[]) => {

        if (data == null) data = [];

        this.searchControl.value.invoicesDB = data
        this.datasource = new MatTableDataSource(this.searchControl.value.invoicesDB)
        this.table.renderRows();

        

  
        if(this.datasource!=null){
          this.datasource.sort = this.sort;
          this.datasource.paginator = this.paginator;
        }
        

      }, err => { console.log(err); this.snackbarService.openSnackBar(this.snackbarService.msgSyncError, this.snackbarService.msgClose) });

    }

  }

  updatePatient() {

   this.disableButtons = true

    let originalPatient = this.selectedPatient
    let updatePatient = this.updatePatientForm.value

   this.createFullnameAttribute(updatePatient)

    this.patientsService.updateDBpatients([originalPatient, updatePatient]).subscribe((data: any) => {


      let patientInvoicesFilter:Invoice = {patientid: this.selectedPatient.ID}
      let patientInvoicesUpdate:Invoice = {patient:updatePatient.fullname, patientdni:updatePatient.dni,patientaddress:updatePatient.address}
      
      //update related info in the patient's invoices
      this.invoicesService.updateDBinvoices([patientInvoicesFilter,patientInvoicesUpdate]).subscribe((data:any)=>{


        this.toggleUpdatePatient()

        this.patientsService.getDBpatients().subscribe((data: Patient[]) => {

          if (data != null) this.patients = data;
  
          this.patients.sort(function(a, b) {
            return a.fullname.localeCompare(b.fullname);
         });
  
          this.updatePatientForm.reset()
                       
          this.clearPatientSearch()

          this.disableButtons = false

        }, err => { 
          console.log(err); 
          this.snackbarService.openSnackBar(this.snackbarService.msgSyncError, this.snackbarService.msgClose);
          this.disableButtons = false 
        })

        this.snackbarService.openSnackBar(this.snackbarService.msgModifyOK, this.snackbarService.msgClose)

      }, err=>{ 
        console.log(err); 
        this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceSyncError, this.snackbarService.msgClose);
        this.disableButtons = false })



    }, err => { 
      console.log(err); 
      this.snackbarService.openSnackBar(this.snackbarService.msgModifyError, this.snackbarService.msgClose);
      this.disableButtons = false })

  }


  updateInvoice(updateInvoice:Invoice) {

    let searchparam = updateInvoice.ID
    let body = updateInvoice

    this.invoicesService.updateDBinvoice(searchparam, body).subscribe((data: any) => {

      this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceModifyOK, this.snackbarService.msgClose)
      this.retrieveInvoices() 

    }, err => { 
      console.log(err); 
      this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceModifyError, this.snackbarService.msgClose) 
    })

  }

  onSearchInvoice(){

    this.disableButtons = true
 
    if(typeof this.searchInvoice !== "number" || this.searchInvoice < 1) {
      this.disableButtons = false
      return;
    }
    
    this.invoicesService.getInvoiceByInvoiceNumber(this.searchInvoice).subscribe((data:Invoice)=>{
 
      this.foundInvoice = data
      //this.searchInvoice = null
      this.isFoundInvoice = true
      this.disableButtons = false
      
    }, err=>{
      console.log(err)
      this.isFoundInvoice = false
      this.snackbarService.openSnackBar(this.snackbarService.msgInvoiceNotFound, this.snackbarService.msgClose);
      this.disableButtons = false
    })
    
  }
 

  createFullnameAttribute(patient: Patient) {


    if (patient.isorg != true && patient.surname != null && patient.surname != "") {


        patient.fullname = patient.name.trim() + " " + patient.surname.trim();
   
    } else {
      patient.fullname = patient.name.trim()

    }

  }

  
  clearPatientSearch() {
    this.searchControl.setValue(""); //if set to null pipe breaks when filtering, string works
    this.selectedPatient = null

    //this.searchControl = new FormControl()
    //this.selectedPatient = { ID: '', name: '' }
    this.showAddInvoice = false
    this.showInvoicesTable = false
    this.formInvoices.reset(this.initInvoiceForm())
    this.toggleShowDetails(false)

  }

  initInvoiceForm(){
    return { units: 1, price: 0, retention: 0, payed: 0, desc: 'Sesión de Fisioterapia', date: new Date().toJSON().split("T")[0] }
  }
  

  //removes nulls and undefined keys from object
  cleanObject(obj: Object) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }

  toggleAddPatient() {
    this.showAddPatient = !this.showAddPatient
    this.showAddOrg = false
    this.addPatientForm.reset()
  }

  toggleAddOrg() {
    this.showAddOrg = !this.showAddOrg
    this.showAddPatient = false
    this.addPatientForm.reset()
  }

  toggleUpdatePatient() {
    this.showUpdatePatient = !this.showUpdatePatient
    if(this.showUpdatePatient===true){
      //this.updatePatientForm.reset({ name: this.selectedPatient.name, surname: this.selectedPatient.surname})
      this.updatePatientForm.reset(this.selectedPatient)
    }
  }

  toggleAddInvoice() {
    this.showAddInvoice = !this.showAddInvoice
    this.formInvoices.reset(this.initInvoiceForm())//, date2: new Date().toJSON().split("T")[0] }  //DELETE
  }

  toggleShowInvoices() {
    this.showInvoicesTable = !this.showInvoicesTable
    this.retrieveInvoices()
  }

  toggleShowDetails(show:boolean){
    this.showDetails = show
  }

  updatePayed(){
    this.formInvoices.patchValue({
      payed: (this.formInvoices.value.units * this.formInvoices.value.price) - (this.formInvoices.value.units * this.formInvoices.value.price * this.formInvoices.value.retention /100)
    });
  }

  displayFn(patient: Patient): string {
    return patient && patient.fullname ? patient.fullname : '';
  }

  private _filter(name: string): Patient[] {

    const filterValue = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return this.patients.filter(patient => patient[this.selectedSearchType].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) === true);
  }
  

  createInvoicePDF(invoice:Invoice){

    console.log(invoice)
    
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
      document.body.appendChild(anchor); //For FF
      anchor.click();
      //It's better to remove the elem
      document.body.removeChild(anchor);
    });


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







