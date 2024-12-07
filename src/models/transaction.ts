import { DataTypes, Model } from "sequelize";
import sequelize from "./index";

class Transaction extends Model {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public createdAt!: Date;
}

Transaction.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    tableName: "transactions",
  }
);

export default Transaction;
