import sequalize from "../utils/database";
import Sequalize from "sequelize";
import patientData from "./patient_dataModel";
import translation from "./translationModel";

export interface IDictionaryModel {
  id: number;
  parent_key_id: number;
  key: string;
  status: number;
  orders: number;
}

const dictionary = sequalize.define(
  "dictionary",
  {
    id: {
      type: Sequalize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    parent_key_id: Sequalize.DataTypes.INTEGER,
    key: {
      type: Sequalize.DataTypes.STRING(70),
      allowNull: false,
    },
    status: Sequalize.DataTypes.INTEGER,
    orders: Sequalize.DataTypes.INTEGER,
  },
  {
    schema: "biteriumai",
    timestamps: false,
    freezeTableName: true,
  }
);

dictionary.hasOne(translation, {foreignKey: 'translation_dict_id', sourceKey: 'id'});

export default dictionary;
