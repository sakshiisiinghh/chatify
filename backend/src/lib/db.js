import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        throw error; // Re-throw to handle in the calling function
    }
};


