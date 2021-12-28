import sequalize from "../utils/database";
import Sequalize from "sequelize";
import user from "./userModel";

const sharedUser = sequalize.define(
  "shared_user",
  {
    id: {
      type: Sequalize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: Sequalize.DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: user,
        key: 'id'
      }
    },
    shared_link: {
      type: Sequalize.DataTypes.STRING(256),
      allowNull: false,
    },
    email: {
      type: Sequalize.DataTypes.STRING(120),
      allowNull: false,
    },
    status: Sequalize.DataTypes.INTEGER,
    create_time: {
      type: Sequalize.DataTypes.DATEONLY,
      allowNull: false,
    },
    update_time: Sequalize.DataTypes.DATEONLY,
  },
  {
    schema: "biteriumai",
    timestamps: false,
    freezeTableName: true,
  }
);

user.hasMany(sharedUser);  // One user should has more shared_user

export default sharedUser;
