import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

//SERVICE NOT USED ANYMORE

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], columnHeaders: any[], excelFileName: string): void {

    console.log(json)

    var filteredJson = json.map(({ invoice_number,date, patient, desc, units, price, retention, payed }) => ({ invoice_number,date, patient, desc, units, price, total: units * price, retention, payed }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredJson)



    /*
    for (let header of columnHeaders) {

      delete worksheet['A1'].w; worksheet['A1'].v = header;
    }*/

    //worksheet['!cols'][1] = { hidden: true };

    var ref = 'A'
    columnHeaders.forEach((header, index) => {

      let columnHeaderPosition = String.fromCharCode(ref.charCodeAt(0) + index) + '1'
      delete worksheet[columnHeaderPosition].w; worksheet[columnHeaderPosition].v = header;
    });




    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getDate() + '.' + new Date().getMonth() + '.' + new Date().getFullYear() + EXCEL_EXTENSION);
  }

}