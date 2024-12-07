import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public balance!: number;
  public role!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.ENUM("client", "admin"),
      defaultValue: "client", // Роль по умолчанию
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
  }
);

export default User;
