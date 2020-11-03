//ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';

//COMPONENTS
import { AppComponent } from './app.component';
import { PatientsComponent } from './components/patients/patients.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { LoginComponent } from './components/login/login.component';
import { EditdialogComponent } from './components/editdialog/editdialog.component';

//SERVICES
import { AuthenticationService } from './services/authentication.service';
import { PatientsService } from './services/patients.service';
import { InvoicesService } from './services/invoices.service';
import { ExcelService } from './services/excel.service';
import { PdfService } from './services/pdf.service';
import { SnackbarService } from './services/snackbar.service';

//DATEPICKER
import { SatDatepickerModule, SatNativeDateModule,  MAT_DATE_LOCALE } from 'saturn-datepicker';

//MATERIAL
import { MatDividerModule } from '@angular/material/divider';

import {
  MatAutocompleteModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
} from '@angular/material';



const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'login', component: LoginComponent }

]

@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,

    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    SatDatepickerModule,
    SatNativeDateModule
  ],
  declarations: []
})
export class MaterialModule { }

@NgModule({
  declarations: [
    AppComponent,
    PatientsComponent,
    InvoicesComponent,
    LoginComponent,
    EditdialogComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatDividerModule,
    MatInputModule, MatButtonModule, MatIconModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
  ],
  exports: [],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    AuthenticationService, 
    PatientsService, 
    InvoicesService, 
    ExcelService, 
    PdfService, 
    SnackbarService, 
    DatePipe,
    {provide:LocationStrategy, useClass:HashLocationStrategy}],
  entryComponents: [
    EditdialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
