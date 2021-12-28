import sequalize from "../utils/database";
import Sequalize from "sequelize";

const timeseriesData = sequalize.define(
  "timeseries_data",
  {
    id: {
      type: Sequalize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    data_time: Sequalize.DataTypes.DATEONLY,
    blood_pressure_abn: Sequalize.DataTypes.BOOLEAN,
    systolic: Sequalize.DataTypes.STRING(30),
    diastolic: Sequalize.DataTypes.STRING(30),
    pulse: Sequalize.DataTypes.STRING(30),
    oxygen_saturation: Sequalize.DataTypes.STRING(30),
    temperature: Sequalize.DataTypes.NUMBER,
    irregular_heart_beat: Sequalize.DataTypes.BOOLEAN,
    patient_id: Sequalize.DataTypes.BIGINT,
    activity: Sequalize.DataTypes.NUMBER,
    create_time: {
      type: Sequalize.DataTypes.DATEONLY,
      allowNull: false,
    },
    update_time: Sequalize.DataTypes.DATEONLY,
    user_id: Sequalize.DataTypes.BIGINT,
    status: Sequalize.DataTypes.INTEGER,
    weakness: Sequalize.DataTypes.BOOLEAN,
    headacke: Sequalize.DataTypes.BOOLEAN,
    bpAbnormality: Sequalize.DataTypes.BOOLEAN,
    irregullarHeartbit: Sequalize.DataTypes.BOOLEAN,
  },
  {
    schema: "biteriumai",
    timestamps: true,
    freezeTableName: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
);

export default timeseriesData;
