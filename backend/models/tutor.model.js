// backend/models/tutor.model.js
import mongoose from 'mongoose';

const availableHourSchema = new mongoose.Schema({
  start: Date,
  end: Date,
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
  day: String,
  hours: [availableHourSchema],
}, { _id: false });

const tutorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  subjects: [String],
  students: [mongoose.Schema.Types.ObjectId],
  roles: [mongoose.Schema.Types.ObjectId],
  profileLink: String,
  bio: { type: String, default: '' },
  availableHours: [dayScheduleSchema],
}, { timestamps: true });

const Tutor = mongoose.model('Tutor', tutorSchema);
export default Tutor;