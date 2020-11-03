import { Invoice } from './invoice';

export interface Patient {
    ID: string
    name: string
    surname?: string
    fullname?: string
    dni?: string
    address?:string
    email?: string
    phone?: string
    invoicesDB?: Invoice[]
    isorg?: boolean
  }