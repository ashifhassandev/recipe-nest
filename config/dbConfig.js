const mongoose = require("mongoose");

// Establish MongoDB connection
const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    const connectionDetails = `${connection.connection.host}:${connection.connection.port}/${connection.connection.name}`;

    console.log(`MongoDB connected: ${connectionDetails}`);
  } catch (error) {
    console.log(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDatabase;