import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '../../../../node_modules/@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Patient } from 'src/app/models/patient';
import { SearchType } from 'src/app/models/searchtype';
import { PatientsService } from 'src/app/services/patients.service';
import { DateValidator, InputValidator } from 'src/app/validators/custom.validators';
import { Invoice } from '../../models/invoice';


export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};



@Component({
  selector: 'app-editdialog',
  templateUrl: './editdialog.component.html',
  styleUrls: ['./editdialog.component.css', '../../../assets/customstyles/dynamic-font.css']
})
export class EditdialogComponent implements OnInit {

  selectedPatient:Patient = null
  searchControl = new FormControl();
  filteredPatients: Observable<Patient[]>;
  patients:Patient[]
  selectedSearchType: string = "fullname"
  searchtypes: SearchType[] = [
    { value: 'fullname', viewValue: 'Nombre' },
    { value: 'dni', viewValue: 'DNI' }
  ];

  updateForm:FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Invoice,
    private patientsService:PatientsService) {}

 
  ngOnInit():void{


    this.updateForm = new FormGroup({
      units: new FormControl(this.data.units,[InputValidator]),
      price: new FormControl(this.data.price,[InputValidator]),
      retention: new FormControl(this.data.retention,[InputValidator]),
      payed: new FormControl(this.data.payed,[InputValidator]),
      desc: new FormControl(this.data.desc),
      date: new FormControl(this.data.date,[DateValidator]),
      //patientinfo: new FormControl(null),
      //searchtype: new FormControl("fullname"),
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
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  processDataAndClose(){

    //let patientinfo = this.updateForm.value.patientinfo
    
    if(this.selectedPatient != null && this.selectedPatient.ID != "" ){
      this.data.patientid = this.selectedPatient.ID
      this.data.patient = this.createFullnameAttribute(this.selectedPatient)
      this.data.patientdni = this.selectedPatient.dni
      this.data.patientaddress =  this.selectedPatient.address
      this.data.isorg = this.selectedPatient.isorg
    }

    this.data.units = this.updateForm.value.units
    this.data.price = this.updateForm.value.price
    this.data.retention = this.updateForm.value.retention
    this.data.payed = this.updateForm.value.payed
    this.data.date = this.updateForm.value.date
    this.data.desc = this.updateForm.value.desc

    this.dialogRef.close(this.data);
    
  }


  clearPatientSearch() {
    this.searchControl.setValue(""); //if set to null pipe breaks when filtering, string works
    this.selectedPatient = null
  }

  createFullnameAttribute(patient: Patient) {

    if (patient.isorg != true && patient.surname != null && patient.surname != "") {
      patient.fullname = patient.name.trim() + " " + patient.surname.trim(); 
    } else {
      patient.fullname = patient.name.trim()
    }

    return patient.fullname
  }
  

  displayFn(patient: Patient): string {
    return patient && patient.fullname ? patient.fullname : '';
  }


  private _filter(name: string): Patient[] {
    const filterValue = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return this.patients.filter(patient => patient[this.selectedSearchType].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filterValue) === true);
  }


}





