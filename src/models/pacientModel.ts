import sequalize from "../utils/database";
import Sequalize from "sequelize";
import patientData from "./patient_dataModel";
import timeseriesData from "./timeseries_dataModel";

export interface IPatientModel {
  id?: number,
  name: string,
  age: number,
  gender: number,
  status?: number,
  height: number,
  weight: number,
  user_id: number,
  create_time?: Date,
  update_time?: Date,
}

const pacient = sequalize.define(
  "patient",
  {
    id: {
      type: Sequalize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequalize.DataTypes.STRING(120),
      allowNull: false,
    },
    age: Sequalize.DataTypes.INTEGER,
    gender: Sequalize.DataTypes.INTEGER,
    height: Sequalize.DataTypes.NUMBER,
    weight: Sequalize.DataTypes.NUMBER,
    create_time: {
      type: Sequalize.DataTypes.DATEONLY,
      allowNull: false,
    },
    update_time: Sequalize.DataTypes.DATEONLY,
    user_id: Sequalize.DataTypes.BIGINT,
    status: Sequalize.DataTypes.INTEGER,
  },
  {
    schema: "biteriumai",
    timestamps: true,
    freezeTableName: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
);

pacient.hasMany(patientData, {foreignKey: 'patient_id', sourceKey: 'id'});
pacient.hasMany(timeseriesData, {foreignKey: 'patient_id', sourceKey: 'id'});

export default pacient;
