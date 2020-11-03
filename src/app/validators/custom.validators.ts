import { AbstractControl } from "@angular/forms";

export { inputValidator as InputValidator }
export { dateValidator as DateValidator }

 function inputValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value < 0 || typeof control.value !== "number") {
      return { 'error': true };
    }
    return null;
  }

  function dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value === "") {
      return { 'error': true };
    }
    return null;
  }

  