/**
 * MongoDB Database Connection
 * Establishes connection to MongoDB using Mongoose ORM
 */

const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connect to MongoDB database
 * @async
 * @throws Process exit(1) on connection failure
 * Logs connection host on successful connection
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
