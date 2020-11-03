import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MatAutocompleteModule, MatDialog, MatSnackBarModule, MatTableModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { delay } from 'rxjs/internal/operators/delay';
import { ExcelService } from 'src/app/services/excel.service';
import { InvoicesService } from 'src/app/services/invoices.service';

import { InvoicesComponent } from './invoices.component';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;
  //let element: ElementRef
  let element,de,invoicesService


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesComponent ],
      imports:[HttpClientTestingModule,RouterTestingModule,MatAutocompleteModule,MatTableModule,MatSnackBarModule  ],
      providers:[DatePipe,{
        provide: MatDialog,
        useValue: {}
      },
    ExcelService,InvoicesService],
      schemas: [
        NO_ERRORS_SCHEMA
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    invoicesService = TestBed.get(InvoicesService);
    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
    //element = fixture.debugElement.nativeElement;
    element = fixture.nativeElement;
    de = fixture.debugElement;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('On getInvoicesRange', fakeAsync(() => {

    //let response = [{ID:"00",fullname:"Third"},{ID:"00",fullname:"Second"},{ID:"01",fullname:"First"}]
  
    spyOn(invoicesService , "getInvoicesRange").and.returnValue(of([{}]).pipe(delay(1)));
   
  
   fixture.detectChanges()
    
    tick(1);
  
    expect(invoicesService.getInvoicesRange).toHaveBeenCalled();
    //expect(service.getDBpatients).toHaveBeenCalled();
    //expect(component.patients[0].fullname).toBe("First");
  
    flush();

  }));
  
});
