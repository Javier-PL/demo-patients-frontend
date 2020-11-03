import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { ExcelService } from './excel.service';

describe('ExcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[BrowserModule,HttpClientModule],
    providers:[ExcelService]
  }));

  it('should be created', () => {
    const service: ExcelService = TestBed.get(ExcelService);
    expect(service).toBeTruthy();
  });
});
