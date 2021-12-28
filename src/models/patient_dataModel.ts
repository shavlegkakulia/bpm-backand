import sequalize from "../utils/database";
import Sequalize from "sequelize";
import dictionary from "./dictionaryModel";

export interface IPatient {
  id: number;
  dict_id: number;
  patient_id: number;
  type: number;
  status: number;
}

const patientData = sequalize.define(
  "patient_data",
  {
    id: {
      type: Sequalize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    dict_id: {
      type: Sequalize.DataTypes.INTEGER,
      allowNull: false,
    },
    patient_id: Sequalize.DataTypes.INTEGER,
    type: Sequalize.DataTypes.INTEGER,
    status: Sequalize.DataTypes.INTEGER,
  },
  {
    schema: "biteriumai",
    timestamps: false,
    freezeTableName: true,
  }
);

patientData.hasOne(dictionary, {foreignKey: 'id', sourceKey: 'dict_id'})

export default patientData;
