import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);

        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB:", err.message);
    }
};

export default connectToMongoDB;

