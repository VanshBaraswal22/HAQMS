const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

console.log("STEP 1: index.js loaded");
console.log("STEP 2: express loaded");
console.log("STEP 3: cors loaded");
console.log("STEP 4: dotenv loaded");

dotenv.config();
console.log("STEP 5: env loaded");

const authRoutes = require('./routes/auth');
console.log("STEP 6: auth loaded");

const patientRoutes = require('./routes/patients');
console.log("STEP 7: patients loaded");

const doctorRoutes = require('./routes/doctors');
console.log("STEP 8: doctors loaded");

const appointmentRoutes = require('./routes/appointments');
console.log("STEP 9: appointments loaded");

const queueRoutes = require('./routes/queue');
console.log("STEP 10: queue loaded");

const reportRoutes = require('./routes/reports');
console.log("STEP 11: reports loaded");
// Load environment variables
dotenv.config();



const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (weak/broad CORS config)
app.use(cors());

// Body parser
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Hospital Appointment and Queue Management System (HAQMS) Backend API',
    status: 'Running',
    version: '1.0.0-deliberate-bugs'
  });
});

// GLOBAL ERROR HANDLER
// BUG: Improper error handling. It returns the raw error stack trace to the client,
// which leaks details about database types, schema layout, and file paths.
app.use((err, req, res, next) => {
  console.error('[CRITICAL-ERROR]:', err);
  res.status(500).json({
    message: 'An unexpected internal server error occurred!',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Listen on port
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`   HAQMS BACKEND SERVER IS RUNNING ON PORT ${PORT}`);
  console.log(`   ENVIRONMENT: ${process.env.NODE_ENV}`);
  console.log(`===================================================`);
});

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Intentionally do not exit process so candidates see unhandled promise logs
});
