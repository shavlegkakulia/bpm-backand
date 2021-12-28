import sequalize from "../utils/database";
import Sequalize, { Sequelize } from "sequelize";

export interface IUserModel {
  id?: number,
  email: string,
  password: string,
  company: string,
  create_time?: Date,
  update_time?: Date,
  status?: number,
  verifyToken?: string
}

const user = sequalize.define(
  "user",
  {
    id: {
      type: Sequalize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequalize.DataTypes.STRING(120),
      allowNull: false,
    },
    password: {
      type: Sequalize.DataTypes.STRING(256),
      allowNull: false,
    },
    company: {
      type: Sequalize.DataTypes.STRING(120),
      allowNull: true,
    },
    create_time: {
      type: Sequalize.DataTypes.DATEONLY,
      allowNull: false,
    },
    update_time: Sequalize.DataTypes.DATEONLY,
    status: Sequalize.DataTypes.INTEGER,
    verifyToken: {
      type: Sequalize.DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    schema: "biteriumai",
    timestamps: true,
    freezeTableName: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
);

export default user;
