import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to the User model (student)
      required: true
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,  // Change to ObjectId to reference Tutor model
      ref: 'Tutor',  // Reference to the Tutor model (tutor)
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
