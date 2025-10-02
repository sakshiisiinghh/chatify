import mongoose from "mongoose";
import dotenv from "dotenv";
 // Adjust path to your user model
import User from "../src/models/user.model.js";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    // 1. Delete all existing users
    console.log("Deleting all existing users...");
    await User.deleteMany({});
    console.log("Users deleted successfully.");

    // 2. Insert fresh, clean data (optional)
    // You can create a few default users here if you want
    // For now, we'll leave it empty to start fresh.
    // Example: await User.create({ fullName: "Admin User", ... });

    console.log("Database has been refreshed!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1);
  }
};

seedDatabase();
