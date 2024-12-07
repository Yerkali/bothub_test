import { Sequelize } from "sequelize";
import sequelize from "../models/index";
import User from "../models/user";
import bcrypt from "bcrypt";

const adminSequelize = new Sequelize(
  process.env.DB_USER!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    dialect: "postgres",
    logging: false, // Отключить логи SQL
  }
);

const setupDatabase = async () => {
  try {
    console.log("Starting database setup...");

    const [results] = await adminSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`
    );

    if ((results as any[]).length === 0) {
      console.log(`Database ${process.env.DB_NAME} does not exist. Creating...`);
      await adminSequelize.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Database ${process.env.DB_NAME} created successfully.`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists.`);
    }

    await sequelize.authenticate();
    console.log(`Connected to database ${process.env.DB_NAME}.`);

    await sequelize.sync({ force: true });
    console.log("All tables created successfully.");

    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      balance: 0,
    });

    console.log(`Admin created: ${admin.email} (password: ${adminPassword})`);
    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Error during database setup:", error);
  } finally {
    await adminSequelize.close();
    process.exit();
  }
};

setupDatabase();
