import { NativeDateAdapter } from 'saturn-datepicker';

export class DateAdapterComponent extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        if (displayFormat == "input") { 
            return  this._to2digit(day) + ' ' + this._toString(month)  + ', ' + year;
        } else {
            return this._toString(month) + ' ' + year;
        }
    }

    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    } 

    private _toString(n: number) {
        let month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dic'];
        return month[n];
    } 
}

 

  export const MY_DATE_FORMATS = {
    parse: {
        dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
    },
    display: {
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'short'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'},
    }
};