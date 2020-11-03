import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDialogRef, MatInputModule, MatSelectModule, MatSnackBarModule, MatTableModule, MAT_DIALOG_DATA } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/internal/operators/delay';
import { Invoice } from 'src/app/models/invoice';
import { Patient } from 'src/app/models/patient';
import { PatientsService } from 'src/app/services/patients.service';

import { EditdialogComponent } from './editdialog.component';

describe('EditdialogComponent', () => {
  let component: EditdialogComponent;
  let fixture: ComponentFixture<EditdialogComponent>;
  let element,de,patientsService;
  let patients_Mock:Patient[],invoice_Mock:Invoice;

  const formBuilder: FormBuilder = new FormBuilder();

  const dialogMock = {
    close: () => { }
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditdialogComponent ],
      imports:[HttpClientTestingModule,RouterTestingModule,MatAutocompleteModule,MatTableModule,MatSnackBarModule,
        ReactiveFormsModule,FormsModule,MatSelectModule,MatInputModule,
        BrowserAnimationsModule  ],
      providers:[DatePipe,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        { provide: FormBuilder, useValue: formBuilder },
        PatientsService,
        {provide: MatDialogRef, useValue: dialogMock},
        ],
      schemas: [
        NO_ERRORS_SCHEMA
    ]
    })
    .compileComponents();
  }));

  beforeEach( () => {

    patientsService = TestBed.get(PatientsService);
    fixture = TestBed.createComponent(EditdialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement
    de = fixture.debugElement;
    //fixture.detectChanges();

    patients_Mock = [{ID:"01",name:"name1",surname:"surname1",fullname:"name1 surname1",dni:"001",address:"address1",phone:"phone1",isorg:false},
    {ID:"02",name:"name2",surname:"surname2",fullname:"name2 surname2",dni:"002",address:"address2",phone:"phone2",isorg:false},
    {ID:"03",name:"name3",fullname:"name3",dni:"003",address:"address3",isorg:true}]

    invoice_Mock = {ID:"01",patientid:"01",invoice_number:200,units:1,price:10,retention:10,payed:5,desc:"mydesc",date:"",patientdni:"001",patientaddress:"myaddress",isorg:false}

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OnInit should get patients', fakeAsync(() => {

    spyOn(patientsService , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
    component.searchControl.setValue(patients_Mock[0]) 
    fixture.detectChanges()

    tick(1)
    
    expect(patientsService.getDBpatients).toHaveBeenCalled();
    expect(component.patients.length).toBe(3);

    flush()

  }));


  it('if patient selected in searchControl, sets selectedPatient', fakeAsync(() => {

    spyOn(patientsService , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
   
    fixture.detectChanges()

    tick(1)
    flush()

    component.searchControl.setValue(patients_Mock[0]) 
    expect(component.selectedPatient.ID).toBe("01");

  }));


  it('if searching, searchControl does not set selectedPatient', fakeAsync(() => {

    spyOn(patientsService , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
   
    fixture.detectChanges()

    tick(1)
    flush()

    component.searchControl.setValue("name1 surname1") 
    expect(component.selectedPatient).toBe(null);

  }));

  it('clearPatientSearch clears selectedPatient', fakeAsync(() => {

    spyOn(patientsService , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
   
    fixture.detectChanges()

    tick(1)
    flush()

    component.searchControl.setValue(patients_Mock[0]) 
    component.clearPatientSearch()
    expect(component.selectedPatient).toBe(null);

  }));


  it('processDataAndClose updates patient data' , fakeAsync(() => {

    component.data = invoice_Mock
    
    spyOn(patientsService , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
    fixture.detectChanges()

    //component.updateForm.controls["units"].setValue(9);
    component.updateForm.controls["price"].setValue(99);
    component.updateForm.controls["retention"].setValue(9);
    component.updateForm.controls["desc"].setValue("updateddesc");
    //component.updateForm.controls["date"].setValue(1);

    tick(1)

    flush()
    
    component.searchControl.setValue(component.patients[1]) 

    component.processDataAndClose()
    expect(component.data.ID).toBe("01");
    expect(component.data.patientid).toBe("02");
    expect(component.data.patient).toBe("name2 surname2");
    expect(component.data.invoice_number).toBe(200);
    expect(component.data.units).toBe(1);
    expect(component.data.price).toBe(99);
    expect(component.data.retention).toBe(9);
    expect(component.data.desc).toBe("updateddesc");
    expect(component.data.date).toBe("");
    expect(component.data.patientdni).toBe("002");
    expect(component.data.patientaddress).toBe("address2");
    expect(component.data.isorg).toBe(false);
  }));

  it('processDataAndClose updates isorg when there is a change' , fakeAsync(() => {

    component.data = invoice_Mock
    
    spyOn(patientsService , "getDBpatients").and.returnValue(of(patients_Mock).pipe(delay(1)));
    fixture.detectChanges()
    tick(1)
    
    flush()
    
    component.searchControl.setValue(component.patients[2]) 
    component.processDataAndClose()
    expect(component.data.ID).toBe("01");
    expect(component.data.patientid).toBe("03");
    expect(component.data.patient).toBe("name3");
    expect(component.data.invoice_number).toBe(200);
    expect(component.data.units).toBe(1);
    expect(component.data.price).toBe(10);
    expect(component.data.retention).toBe(10);
    expect(component.data.desc).toBe("mydesc");
    expect(component.data.date).toBe("");
    expect(component.data.patientdni).toBe("003");
    expect(component.data.patientaddress).toBe("address3");
    expect(component.data.isorg).toBe(true);
  }));

  it('should create the full name', () => {
    expect(component.createFullnameAttribute(patients_Mock[2])).toEqual("name3");
    expect(component.createFullnameAttribute(patients_Mock[1])).toEqual("name2 surname2");
    expect(component.createFullnameAttribute({ID:"000",name:" John Bohn ",surname:" Doe Boe "})).toEqual("John Bohn Doe Boe");
    expect(component.createFullnameAttribute({ID:"000",name:" John Bohn ",surname:" Doe Boe ",isorg:true})).toEqual("John Bohn");
  });



});
