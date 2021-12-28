import sequalize from "../utils/database";
import Sequalize from "sequelize";
import dictionary from "./dictionaryModel";

export interface ITranslationModel {
  id: number;
  translation_dict_id: number;
  name: string;
  description: string;
  locale_id: number;
}

const translation = sequalize.define(
  "translation",
  {
    id: {
      type: Sequalize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    translation_dict_id: {
      type: Sequalize.DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequalize.DataTypes.STRING(256),
      allowNull: false,
    },
    description: Sequalize.DataTypes.STRING(1024),
    locale_id: Sequalize.DataTypes.INTEGER,
  },
  {
    schema: "biteriumai",
    timestamps: false,
    freezeTableName: true,
  }
);

export default translation;
