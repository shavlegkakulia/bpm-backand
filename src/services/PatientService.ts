import { PatientCRUID } from "../implementations/PatientCRUID";
import Patient, { IPatientModel } from "./../models/pacientModel";

class PatientService implements PatientCRUID {
  add = async (patient: IPatientModel) => {
    return Patient.create({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      height: patient.height,
      weight: patient.weight,
      user_id: patient.user_id,
    });
  };
}

export default new PatientService();
