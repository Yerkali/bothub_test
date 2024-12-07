import User from "../models/user";
import Transaction from "../models/transaction";

export const updateBalance = async (userId: number, amount: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.balance += amount;
  await user.save();

  await Transaction.create({ userId, amount });
};

export const checkBalance = async (userId: number, cost: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  if (user.balance < cost) {
    throw new Error("Insufficient balance");
  }
};

export const deductTokens = async (userId: number, cost: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  if (user.balance < cost) {
    throw new Error("Insufficient balance");
  }

  user.balance -= cost;
  await user.save();

  return user.balance;
};

export const addTokens = async (userId: number, amount: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.balance += amount;
  await user.save();

  return user.balance;
};