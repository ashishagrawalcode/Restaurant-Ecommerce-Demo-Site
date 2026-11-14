// db.js - MongoDB database connection setup
const mongoose = require('mongoose');

let isMongoConnected = false;
let models = {};

async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.log('MONGO_URI missing in .env');
    return false;
  }

  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(mongoURI, {
      dbName: 'saffron_plate',
      serverSelectionTimeoutMS: 10000
    });

    isMongoConnected = true;
    console.log('MongoDB connected successfully!');

    // compile Mongoose models from schemas
    const menuSchema = new mongoose.Schema(require('../models/Menu'), { timestamps: true });
    const orderSchema = new mongoose.Schema(require('../models/Order'), { timestamps: true });
    const reservationSchema = new mongoose.Schema(require('../models/Reservation'), { timestamps: true });
    const contactSchema = new mongoose.Schema(require('../models/Contact'), { timestamps: true });
    const userSchema = new mongoose.Schema(require('../models/User'), { timestamps: true });
    const reviewSchema = new mongoose.Schema(require('../models/Review'), { timestamps: true });

    models = {
      Menu: mongoose.models.Menu || mongoose.model('Menu', menuSchema),
      Order: mongoose.models.Order || mongoose.model('Order', orderSchema),
      Reservation: mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema),
      Contact: mongoose.models.Contact || mongoose.model('Contact', contactSchema),
      User: mongoose.models.User || mongoose.model('User', userSchema),
      Review: mongoose.models.Review || mongoose.model('Review', reviewSchema)
    };

    return true;

  } catch (err) {
    console.error('MongoDB connection failed!');
    console.error('Reason:', err.message);

    isMongoConnected = false;
    console.log('Running in JSON database mode');
    return false;
  }
}

function getDbStatus() {
  return isMongoConnected ? 'mongodb' : 'json_file';
}

function getModels() {
  return models;
}

function isConnected() {
  return isMongoConnected;
}

module.exports = { connectDB, getDbStatus, getModels, isConnected };
