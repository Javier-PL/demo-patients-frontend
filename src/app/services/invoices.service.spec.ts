import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';

import { InvoicesService } from './invoices.service';

describe('InvoicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[BrowserModule,HttpClientModule],
  }));

  it('should be created', () => {
    const service: InvoicesService = TestBed.get(InvoicesService);
    expect(service).toBeTruthy();
  });
});
