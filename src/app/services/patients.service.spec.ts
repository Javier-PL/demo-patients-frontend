import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[BrowserModule,HttpClientModule],
  }));

  it('should be created', () => {
    const service: PatientsService = TestBed.get(PatientsService);
    expect(service).toBeTruthy();
  });
});
