// src/models/Appointment.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model
      required: true
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    tutor: {
      type: String,
      required: true
    },
    feedbackSubmitted: {
      type: Boolean,
      default: false
    },
    feedback: {
      type: String,
      default: ''
    },
    joinUrl: {
      type: String,
      default: ''
    },
    files: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
