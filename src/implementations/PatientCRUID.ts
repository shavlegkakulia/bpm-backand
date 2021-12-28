import { IPatientModel } from "../models/pacientModel";


export interface PatientCRUID {
    add: (patient: IPatientModel) => Promise<any>;
}