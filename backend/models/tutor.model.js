import mongoose from 'mongoose';

const availableSlotSchema = new mongoose.Schema({
  start: { type: Date }, // e.g., 2023-06-01T09:00:00
  end: { type: Date },   // e.g., 2023-06-01T10:00:00
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
  day: { 
    type: String, 
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  },
  hours: [availableSlotSchema],  // Store start and end as Date objects
}, { _id: false });

const tutorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  subjects: [String],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      default: new mongoose.Types.ObjectId('67fc5b4862b00200769805b5'), // Hardcoded role ID
    }
  ],
  availableHours: [dayScheduleSchema],  // Array of days with time slots (Date objects)
}, { timestamps: true });

const Tutor = mongoose.model('users', tutorSchema);
export default Tutor;
