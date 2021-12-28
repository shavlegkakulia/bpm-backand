import sequalize from "../utils/database";
import Sequalize from "sequelize";

const locale = sequalize.define(
  "locale",
  {
    id: {
      type: Sequalize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: Sequalize.DataTypes.STRING(120),
    key: Sequalize.DataTypes.STRING(70),
  },
  {
    schema: "biteriumai",
    timestamps: false,
    freezeTableName: true
  }
);

export default locale;
