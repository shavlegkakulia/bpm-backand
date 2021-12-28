
export interface ITaimseriesInputData {
  id: number;
  timeSeriesDate: string;
  activity: number;
  weakness: boolean;
  headacke: boolean;
  bpAbnormality: boolean;
  irregullarHeartbit: boolean;
  systolic: number;
  diastolic: number;
  pulse: number;
  oxygenSaturation: number;
  patient_id: number;
}

export interface ITaimseriesInput {
    timeseriesInput: ITaimseriesInputData;
}

interface IPatientInputData {
  patient_id: number;
  name: string;
  age: number;
  gender: number;
  height: number;
  weight: number;
  bodyTemprature: number;
  totalCollesterol: number;
  timeSeries: ITaimseriesInputData;
  habits: string;
}

export interface IPatientInput {
  patientInput: IPatientInputData;
}

const schema = `
type PatientResponse {
    data: Patient
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type GabitsAndHilnsessResponse {
    data: DictDataResponse
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type DictionaryDataResponse {
    data: DictDataResponse
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type Response {
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type Patient {
    id: ID!
}

type DictDataResponse {
    hilness: [DictData]
    human_habits: [DictData]
}

type DictData {
    id: ID
    translation_dict_id: Int
    name: String
    description: String
}

input TaimseriesInput {
    id: Int
    timeSeriesDate: String!
    activity: Int!
    weakness: Boolean!
    headacke: Boolean!
    bpAbnormality: Boolean!
    irregullarHeartbit: Boolean!
    systolic: Float!
    diastolic: Float!
    pulse: Float!
    oxygenSaturation: Float!
    patient_id: Int
}

input PatientInputData {
    name: String
    age: Int!
    gender: Int!
    height: Float!
    weight: Float!
    bodyTemprature: Float!
    totalCollesterol: Float!
    timeSeries: TaimseriesInput
    habits: String
    patient_id: Int
}

type TranslationKey {
    name: String
}

type DictionaryKey {
    key: String
    translation: TranslationKey
}

type PatientData {
    id: Int
    dict_id: Int
    patient_id: Int
    dictionary: DictionaryKey
}

type TimeseriesData {
    id: Int
    data_time: String
    systolic: Float
    diastolic: Float
    pulse: Float
    oxygen_saturation: Float
    temperature: Float
    irregular_heart_beat: Boolean
    activity: Int
    weakness: Boolean
    headacke: Boolean
    bpAbnormality: Boolean
    irregullarHeartbit: Boolean
}

type AllPatientsResponseData {
    id: Int!
    name: String
    age: Int
    gender: Int
    height: Float
    weight: Float
    user_id: Int
    patient_data: [PatientData]
    timeseries_data: [TimeseriesData]
    create_time: String
}

type PatientsResponseData {
    id: Int!
    name: String
    age: Int
    gender: Int
    height: Float
    weight: Float
    user_id: Int
    patient_data: [PatientData]
    timeseries_data: [TimeseriesData]
}

type AllPatientsDataResponse {
    data: [AllPatientsResponseData]
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type PatientDataResponse {
    data: PatientsResponseData
    succes: Boolean!
    errorMessage: [String]!
    code: Int!
}

type RootQuery {
    getGabitsAndHilnsess: GabitsAndHilnsessResponse!
    getDictionary: DictionaryDataResponse!
    getPatients: AllPatientsDataResponse!
    getPatient(patient_id: Int!): PatientDataResponse!
}

type RootMutation {
    addPatient(patientInput: PatientInputData): PatientResponse!
    editPatient(patientInput: PatientInputData): Response!
    deletePatientTimeseries(t_id: Int!): Response!
    addTimeSeries(timeseriesInput: TaimseriesInput): Response!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`;

export default schema;
