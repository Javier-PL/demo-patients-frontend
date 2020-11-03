import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { PdfService } from './pdf.service';

describe('PdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[BrowserModule,HttpClientModule],
  }));

  it('should be created', () => {
    const service: PdfService = TestBed.get(PdfService);
    expect(service).toBeTruthy();
  });
});
