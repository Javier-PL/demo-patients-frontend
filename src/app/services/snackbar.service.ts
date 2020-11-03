import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  msgPatientOK:string = "Añadido nuevo paciente"
  msgOrgOK:string = "Añadido nuevo paciente"
  msgInvoiceOK:string = "Añadida nueva factura"
  msgModifyOK:string = "Modificación terminada corréctamente"
  msgInvoiceModifyOK:string = "Factura modificada corréctamente"
  
  msgInvoiceNotFound:string = "No se ha encontrado ninguna factura"
  msgInvoicesNotFound:string = "No se han encontrado facturas en esas fechas."

  msgClose:string = "Cerrar"

  msgPatientError:string = "Error al crear nuevo paciente"
  msgOrgError:string = "Error al crear nueva organización"
  msgSyncError:string = "Error de sincronización"
  msgInvoiceError:string = "Error al crear nueva factura"
  msgSelectError:string = "Error : seleccione corréctamente un paciente de la lista"
  msgInvoiceSyncError:string="Error de sincronización de facturas"
  msgModifyError:string="Error al modificar paciente/organización"
  msgInvoiceModifyError:string = "Error al modificar factura"

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }

}
