export interface Invoice {
    ID?: string
    patient?: string
    patientid?: string
    invoice_number?: number
    units?: number
    price?: number
    retention?: number
    payed?: number
    desc?: string
    date?: string
    patientdni?:string
    patientaddress?:string
    isorg?:boolean

  }
  