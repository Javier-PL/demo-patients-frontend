import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { delay } from 'rxjs/internal/operators/delay';
import { Token } from 'src/app/models/token';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let element,de,authenticationService;
  let token: Token;

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent,
        ],
      imports:[HttpClientTestingModule,RouterTestingModule.withRoutes(
        [{path: 'patients', redirectTo: ''}]),ReactiveFormsModule,FormsModule,MatSelectModule,MatInputModule,
        BrowserAnimationsModule],
      providers:[
        { provide: FormBuilder, useValue: formBuilder },
        AuthenticationService,
      ],
      schemas: [
        NO_ERRORS_SCHEMA
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.get(AuthenticationService);
    element = fixture.nativeElement
    de = fixture.debugElement;

    token = {token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE0NzU4NzgzNTd9.Kp77j7dwHP4IYmvqKArdeXTLbxkiaM_I6SgqTxDYsSQ"}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On login filled form valid', () => {
    component.loginForm.controls['username'].setValue("User");
    component.loginForm.controls['password'].setValue("Pass");
    expect(component.loginForm.valid).toBeTruthy();

  });

  /*
  it('On login filled form valid', () => {
    component.loginForm.controls['username'].setValue("User");
    expect(component.loginForm.valid).toBeFalsy();

  });*/


  it('On login token and data retrieved', fakeAsync(() => {
    

    spyOn(authenticationService , "authenticate").and.returnValue(of(token).pipe(delay(1)));

    fixture.detectChanges()

    component.loginForm.controls['username'].setValue("User");
    component.loginForm.controls['password'].setValue("Pass");

    component.login()

    expect(component.loginForm.valid).toBeTruthy();

    expect(component.loginForm.value.username).toBe("User");
    expect(component.loginForm.value.password).toBe("Pass");

    expect(authenticationService.TOKEN).toBe("");
    expect(authenticationService.TOKENINFO).toEqual(jasmine.any(Object));

    expect(authenticationService.isAuthorised).toBe(false);
    expect(component.isLoginFailed).toBe(undefined);

    
    tick(1)

    expect(authenticationService.authenticate).toHaveBeenCalled();
    expect(authenticationService.TOKEN).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE0NzU4NzgzNTd9.Kp77j7dwHP4IYmvqKArdeXTLbxkiaM_I6SgqTxDYsSQ");
    expect(authenticationService.TOKENINFO).toEqual(jasmine.any(Object));
    expect(authenticationService.TOKENINFO).toEqual(jasmine.objectContaining({
      exp: 1475878357
    }));

    expect(authenticationService.isAuthorised).toBe(true);
    expect(component.isLoginFailed).toBe(false);
    
    flush()


  }));

  
  it('On failed login ', fakeAsync(() => {
    
    spyOn(authenticationService , "authenticate").and.returnValue(throwError('error'));

    fixture.detectChanges()

    component.loginForm.controls['username'].setValue("User");
    component.loginForm.controls['password'].setValue("Pass");

    component.login()
 
    tick(1)

    expect(component.isLoginFailed).toBe(true);
    expect(authenticationService.isAuthorised).toBe(false);
    
    flush()


  }));

});
