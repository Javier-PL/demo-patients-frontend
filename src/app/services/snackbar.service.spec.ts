import { OVERLAY_PROVIDERS } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[BrowserModule,HttpClientModule],
    providers:[MatSnackBar,OVERLAY_PROVIDERS]
  }));

  it('should be created', () => {
    const service: SnackbarService = TestBed.get(SnackbarService);
    expect(service).toBeTruthy();
  });
});
