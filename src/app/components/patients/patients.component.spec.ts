
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import {  MatDialog, MatDialogRef, MatInputModule, MatSelectModule, MatSnackBarModule } from '@angular/material'; 
//MatSelectModule fixes: No value accessor for form control. Cause of mat-form-field elements
//MatInputModule fixes: must contain a MatFormFieldControl.
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing'; 

import {  PatientsComponent } from './patients.component';

import { ReactiveFormsModule, FormBuilder,FormsModule  } from '@angular/forms';

import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '../../../../node_modules/@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PatientsService } from 'src/app/services/patients.service';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/internal/operators/delay';
import { Patient } from 'src/app/models/patient';
import { InvoicesService } from 'src/app/services/invoices.service';
import { Invoice } from 'src/app/models/invoice';

describe('PatientsComponent', () => {
  let component: PatientsComponent;
  let fixture: ComponentFixture<PatientsComponent>;
  let element,de,service,invoicesService;
  let patients_Mock: Patient[],invoice_Mock:Invoice;
  let dialog: any;

  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

  class dialogMock {
    open() {
      return {
        afterClosed: () => of({})
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientsComponent ],
      imports:[HttpClientTestingModule,RouterTestingModule,MatAutocompleteModule,
        MatTableModule,MatSnackBarModule,ReactiveFormsModule,FormsModule,MatSelectModule,MatInputModule,
        BrowserAnimationsModule  ],
      providers:[DatePipe,
        {
        provide: MatDialog,
        useValue: new dialogMock()
      },
      { provide: FormBuilder, 
        useValue: formBuilder 
      },
      PatientsService,InvoicesService,
     // {provide: MatDialogRef, useValue: new dialogMock() }
    ],
      schemas: [
        NO_ERRORS_SCHEMA
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    dialog = TestBed.get(MatDialog);
    service = TestBed.get(PatientsService);
    invoicesService = TestBed.get(InvoicesService);
    fixture = TestBed.createComponent(PatientsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement
    de = fixture.debugElement;


    patients_Mock = [{ID:"01",name:"name1",surname:"surname1",fullname:"name1 surname1",dni:"001",address:"address1",phone:"phone1",isorg:false},
    {ID:"02",name:"name2",surname:"surname2",fullname:"name2 surname2",dni:"002",address:"address2",phone:"phone2",isorg:false},
    {ID:"03",name:"name3",fullname:"name3",dni:"003",address:"address3",isorg:true}]

    invoice_Mock = {ID:"01",patientid:"01",invoice_number:200,units:1,price:10,retention:10,payed:5,desc:"mydesc",date:"2020-10-23T00:00:00Z",patientdni:"001",patientaddress:"myaddress",isorg:false}

    component.showAddPatient = true;
    component.ngOnInit();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addPatientForm valid when name filled', () => {
    component.addPatientForm.controls['name'].setValue("John");
    expect(component.addPatientForm.valid).toBeTruthy();

  });



  it('addPatientForm invalid when empty', () => {

    expect(component.addPatientForm.value.name).toBe('');
    expect(component.addPatientForm.value.surname).toBe(null);
    expect(component.addPatientForm.value.dni).toBe(null);
    expect(component.addPatientForm.value.email).toBe(null);
    expect(component.addPatientForm.value.address).toBe(null);
    expect(component.addPatientForm.value.phone).toBe(null);
    expect(component.addPatientForm.valid).toBeFalsy();
  });

  it('addPatientForm invalid when string fields have numbers', () => {

    component.addPatientForm.controls['dni'].setValue(1);
    expect(component.addPatientForm.valid).toBeFalsy();
  });
  
  it('On addPatient (false) patient isorg is undefined', () => {
    component.addPatientForm.controls['name'].setValue("John");
    expect(component.addPatientForm.valid).toBeTruthy();
    component.addPatient(false)
    expect(component.addPatientForm.value.isorg).toBe(undefined);;
});

  it('On addPatient (true) patient isorg is true', () => {
    component.addPatientForm.controls['name'].setValue("John");
    expect(component.addPatientForm.valid).toBeTruthy();
    component.addPatient(true)
    expect(component.addPatientForm.value.isorg).toBe(true);
});

it('On addPatient postDBpatients cleaned addPatientForm', fakeAsync(() => {

  let response = [{ID:"00",fullname:"Third"},{ID:"00",fullname:"Second"},{ID:"01",fullname:"First"}]

  spyOn(service , "postDBpatients").and.returnValue(of([{}]).pipe(delay(1)));
  spyOn(service , "getDBpatients").and.returnValue(of(response).pipe(delay(1)));

  component.addPatient(false)
  
  tick(2);

  expect(service.postDBpatients).toHaveBeenCalled();
  expect(service.getDBpatients).toHaveBeenCalled();
  expect(component.patients[0].fullname).toBe("First");

  flush();
}));

it('On addPatient form is submitted right', fakeAsync(() => {

  component.addPatientForm.controls['name'].setValue("John");
  component.addPatientForm.controls['surname'].setValue("Doe");
  component.addPatientForm.controls['dni'].setValue("mydni");
  component.addPatientForm.controls['email'].setValue("myemail");
  //component.addPatientForm.controls['address'].setValue("myaddress");
  component.addPatientForm.controls['phone'].setValue("myphone");
  expect(component.addPatientForm.valid).toBeTruthy();

  spyOn(component, 'createFullnameAttribute');
  spyOn(service , "postDBpatients").and.returnValue(of([{}]).pipe(delay(1)));
  spyOn(service , "getDBpatients").and.returnValue(of([{}]).pipe(delay(1)));

  component.addPatient(false)

  expect(component.createFullnameAttribute).toHaveBeenCalled();
  
  expect(component.addPatientForm.value.name).toBe("John");
  expect(component.addPatientForm.value.surname).toBe("Doe");
  expect(component.addPatientForm.value.dni).toBe("mydni");
  expect(component.addPatientForm.value.email).toBe("myemail");
  expect(component.addPatientForm.value.address).toBe(undefined);
  expect(component.addPatientForm.value.phone).toBe("myphone");
  expect(component.addPatientForm.value.isorg).toBe(undefined);
  

  
  tick(2);

  expect(service.postDBpatients).toHaveBeenCalled();
  expect(service.getDBpatients).toHaveBeenCalled();

  flush();
}));

  it('On addPatient returned patients are sorted', fakeAsync(() => {

    let response = [{ID:"00",fullname:"Third"},{ID:"00",fullname:"Second"},{ID:"01",fullname:"First"}]

    spyOn(service , "postDBpatients").and.returnValue(of([{}]).pipe(delay(1)));
    spyOn(service , "getDBpatients").and.returnValue(of(response).pipe(delay(1)));

    component.addPatient(false)
    tick(2);
    expect(component.patients[0].fullname).toBe("First");
    flush();
}));

  it('On addPatient addPatientForm is resetted', fakeAsync(() => {
  
    spyOn(service , "postDBpatients").and.returnValue(of([{}]).pipe(delay(1)));
    spyOn(service , "getDBpatients").and.returnValue(of([{}]).pipe(delay(1)));

    component.addPatientForm.controls['name'].setValue("John");
    component.addPatient(false)
    
    expect(component.addPatientForm.value.name).toBe("John");


    tick(2);


    expect(service.postDBpatients).toHaveBeenCalled();
    expect(service.getDBpatients).toHaveBeenCalled();
   
    expect(component.addPatientForm.value.name).toBe(null);

    flush();
}));
 

it('formInvoices invalid when input field has string', () => {

  component.formInvoices.controls['units'].setValue("test");
  expect(component.formInvoices.valid).toBeFalsy();
});
it('formInvoices invalid when input field is < 0', () => {

  component.formInvoices.controls['units'].setValue(-1);
  expect(component.formInvoices.valid).toBeFalsy();
});
it('formInvoices invalid when date field is not set', () => {

  component.formInvoices.controls['date'].setValue("");
  expect(component.formInvoices.valid).toBeFalsy();
});

it('if patient selected in searchControl, sets selectedPatient', fakeAsync(() => {

  spyOn(service , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
 
  fixture.detectChanges()

  tick(1)
  flush()

  component.searchControl.setValue(patients_Mock[0]) 
  expect(component.selectedPatient.ID).toBe("01");

}));

it('if searching, searchControl does not set selectedPatient', fakeAsync(() => {

  spyOn(service , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
 
  fixture.detectChanges()

  tick(1)
  flush()

  component.searchControl.setValue("name1 surname1") 
  expect(component.selectedPatient).toBe(null);

}));

it('clearPatientSearch clears selectedPatient', fakeAsync(() => {

  spyOn(service , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
 
  fixture.detectChanges()

  tick(1)
  flush()

  component.searchControl.setValue(patients_Mock[0]) 
  component.clearPatientSearch()
  expect(component.selectedPatient).toBe(null);

}));

it('On addInvoice invoice.isorg is undefined when not org', () => {

  component.searchControl.setValue(patients_Mock[0]) 
  component.addInvoice()
  expect(component.formInvoices.value.patient).toBe("name1 surname1");
  expect(component.formInvoices.value.patientid).toBe("01");
  expect(component.formInvoices.value.patientdni).toBe("001");
  expect(component.formInvoices.value.patientaddress).toBe("address1");
  expect(component.formInvoices.value.isorg).toBe(undefined);
});

it('On addInvoice invoice.isorg is true when org', () => {

  component.searchControl.setValue(patients_Mock[2]) 
  component.addInvoice()
  expect(component.formInvoices.value.patient).toBe("name3");
  expect(component.formInvoices.value.patientid).toBe("03");
  expect(component.formInvoices.value.patientdni).toBe("003");
  expect(component.formInvoices.value.patientaddress).toBe("address3");
  expect(component.formInvoices.value.isorg).toBe(true);
});

it('On addInvoice invoice form resets', fakeAsync(() => {

  spyOn(invoicesService , "postDBinvoices").and.returnValue(of({}).pipe(delay(1)));
  
  fixture.detectChanges()

  component.searchControl.setValue(patients_Mock[0])
  component.formInvoices.controls['units'].setValue(3);
  component.formInvoices.controls['price'].setValue(3);
  component.formInvoices.controls['retention'].setValue(3);
  component.formInvoices.controls['payed'].setValue(3);
  component.formInvoices.controls['desc'].setValue("just a test");
  component.addInvoice()

  tick(1)

  expect(invoicesService.postDBinvoices).toHaveBeenCalled();

  flush()

  expect(component.formInvoices.value.units).toBe(1);
  expect(component.formInvoices.value.price).toBe(0);
  expect(component.formInvoices.value.retention).toBe(0);
  expect(component.formInvoices.value.payed).toBe(0);
  expect(component.formInvoices.value.desc).toBe('Sesión de Fisioterapia');
  //expect(component.formInvoices.value.date).toBe(0);

  

}));

it('On openEditInvoiceDialog the date is formatted', fakeAsync(() => {

  fixture.detectChanges()

  expect(invoice_Mock.date).toBe("2020-10-23T00:00:00Z");
  component.openEditInvoiceDialog(invoice_Mock)
  tick(1)
  flush()
  expect(invoice_Mock.date).toBe("2020-10-23");

}));

it('On openEditInvoiceDialog to be open', fakeAsync(() => {

  spyOn(dialog, 'open').and.callThrough();

  fixture.detectChanges()

  component.openEditInvoiceDialog(invoice_Mock)
  tick(1)

  expect(dialog.open).toHaveBeenCalled();

  flush()

}));



});
